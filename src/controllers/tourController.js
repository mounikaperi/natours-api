/* eslint-disable prettier/prettier */
const Tour = require("../models/tourModel");
const factoryHandler = require('../handlers/factoryHandler');
const { HTTP_STATUS_CODES, HTTP_STATUS } = require("../utils/constants");
const catchAsync = require("../utils/commonUtils");
const AppError = require("../utils/AppError");

exports.aliasTopTours = (request, response, next) => {
  request.query.limit = '5';
  request.query.sort = '-ratingsAverage,price';
  request.query.fields = 'name,price,ratingsAverage,summary,difficulty';
  next();
};

exports.getAllTours = factoryHandler.getAll(Tour);
exports.getTour = factoryHandler.getOne(Tour);
exports.createTour = factoryHandler.createOne(Tour);
exports.updateTour = factoryHandler.updateOne(Tour);
exports.deleteTour = factoryHandler.deleteOne(Tour);

exports.getTourStats = catchAsync(async (request, response, next) => {
  const statistics = await Tour.aggregate([
    {
      $match: { ratingsAverage: { $gte: 4.5 } }
    },
    {
      $group: {
        _id: { $toUpper: '$difficulty' },
        numTours: { $sum: 1 },
        numRatings: { $sum: '$ratingsQuantity' },
        avgRating: { $avg: '$ratingsAverage' },
        avgPrice: { $avg: '$price' },
        minPrice: { $min: '$price' },
        maxPrice: { $max: '$price' }
      }
    },
    {
      $sort: { avgPrice: 1 }
    }
  ]);
  response
    .status(HTTP_STATUS_CODES.SUCCESSFUL_RESPONSE.OK)
    .json({
      status: HTTP_STATUS.SUCCESS,
      data: {
        statistics
      }
    })
});

exports.getMonthlyPlan = catchAsync(async (request, response, next) => {
  const year = request.params.year * 1;
  const plan = await Tour.aggregate([
    {
      $unwind: '$startDates'
    },
    {
      $match: {
        startDates: {
          $gte: new Date(`${year}-01-01`),
          $lte: new Date(`${year}-12-31`)
        }
      }
    },
    {
      $group: {
        _id: { $month: '$startDates' },
        numTourStats: { $sum: 1 },
        tours: { $push: '$name'}
      }
    },
    {
      $addFields: { month: '$_id' }
    },
    {
      $project: {
        _id: 0
      }
    },
    {
      $sort: {
        numTourStats: -1
      }
    },
    {
      $limit: 12
    }
  ]);
  response
    .status(HTTP_STATUS_CODES.SUCCESSFUL_RESPONSE.OK)
    .json({
      status: HTTP_STATUS.SUCCESS,
      data: {
        plan
      }
    })
});

// /tours-within/:distance/center/:latlng/unit/:unit
// /tours-within/233/center/34.111745,-118.113491/unit/mi
exports.getToursWithin = catchAsync(async (request, response, next) => {
  const { distance, latlng, unit } = request.params || {};
  const [latitude, longitude] = latlng.split(',');
  const radius = unit === 'mi' ? (distance/3963.2) : (distance/6378.1);
  if (!latitude || !longitude) {
    next(new AppError('Please provide latitide and longitude in the format lat,lng', HTTP_STATUS_CODES.CLIENT_ERROR_RESPONSE.BAD_REQUEST));
  }
  const tours = await Tour.find({
    startLocation: { $geoWithin: { $centerSphere: [[latitude, longitude], radius] } }
  });
  response.status(HTTP_STATUS_CODES.SUCCESSFUL_RESPONSE.OK).json({
    status: HTTP_STATUS.SUCCESS,
    results: tours.length,
    data: {
      data: tours
    }
  });
});

exports.getDistances = catchAsync(async (request, response, next) => {
  const { latlng, unit } = request.params || {};
  const [latitude, longitude] = latlng.split(',');
  const multiplier = unit === 'mi' ? 0.000621371 : 0.001;
  if (!latitude || !longitude) {
    next(new AppError('Please provide latitide and longitude in the format lat,lng', HTTP_STATUS_CODES.CLIENT_ERROR_RESPONSE.BAD_REQUEST));
  }
  const distances = await Tour.aggregate([
    {
      $geoNear: {
        near: {
          type: 'Point',
          coordinates: [longitude * 1, latitude * 1]
        },
        distanceField: 'distance',
        distanceMultiplier: multiplier
      }
    },
    {
      $project: {
        distance: 1,
        name: 1
      }
    }
  ]);
  response.status(HTTP_STATUS_CODES.SUCCESSFUL_RESPONSE.OK).json({
    status: HTTP_STATUS.SUCCESS,
    data: {
      data: distances
    }
  });
});