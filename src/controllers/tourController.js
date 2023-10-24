/* eslint-disable prettier/prettier */
const Tour = require("../models/tourModel");
const { HTTP_STATUS_CODES, HTTP_STATUS } = require("../utils/constants");
const catchAsync = require("../utils/commonUtils");
const AppError = require("../utils/AppError");

exports.aliasTopTours = (request, response, next) => {
  request.query.limit = '5';
  request.query.sort = '-ratingsAverage,price';
  request.query.fields = 'name,price,ratingsAverage,summary,difficulty';
  next();
};

exports.getAllTours = catchAsync(async (request, response, next) => {
  const tours = await Tour.find();
  response
    .status(HTTP_STATUS_CODES.SUCCESSFUL_RESPONSE.OK)
    .json({
      status: HTTP_STATUS.SUCCESS,
      totalNumberOfTours: tours.length,
      data: { tours }
    }
    );
});

exports.getTour = catchAsync(async (request, response, next) => {
  const { params } = request || {};
  const { id: tourId } = params || {};
  const tour = await Tour.findById(tourId).populate({ 
    path: 'guides',
    select: '-__v -passwordChangedAt' 
  });
  if (!tour) {
    return next(new AppError('No tour found with that ID', HTTP_STATUS_CODES.CLIENT_ERROR_RESPONSE.NOT_FOUND))
  }
  response
    .status(HTTP_STATUS_CODES.SUCCESSFUL_RESPONSE.OK)
    .json({
      status: HTTP_STATUS.SUCCESS,
      data: { tour }
    });
});

exports.createTour = catchAsync(async (request, response, next) => {
  const newTour = await Tour.create(request.body);
  response
    .status(HTTP_STATUS_CODES.SUCCESSFUL_RESPONSE.CREATED)
    .json({
      status: HTTP_STATUS.SUCCESS,
      data: {
        tour: newTour
      }
    });
});

exports.updateTour = catchAsync(async (request, response, next) => {
  const { params, body } = request || {};
  const { id: tourId } = params || {};
  const updatedTour = await Tour.findByIdAndUpdate(tourId, body, {
    new: true,
    runValidators: true
  })
  if (!updatedTour) {
    return next(new AppError('No tour found with the ID', HTTP_STATUS_CODES.CLIENT_ERROR_RESPONSE.NOT_FOUND))
  }
  response
    .status(HTTP_STATUS_CODES.SUCCESSFUL_RESPONSE.OK)
    .json({
      status: HTTP_STATUS.SUCCESS,
      data: {
        updatedTour
      }
    });
})

exports.deleteTour = catchAsync(async (request, response, next) => {
  const tour = await Tour.findByIdAndDelete(request.params.id);
  if (!tour) {
    return next(new AppError('No tour found with the ID', HTTP_STATUS_CODES.CLIENT_ERROR_RESPONSE.BAD_REQUEST))
  }
  response
    .status(HTTP_STATUS_CODES.SUCCESSFUL_RESPONSE.NO_CONTENT)
    .json({
      status: HTTP_STATUS.SUCCESS,
      message: "The tour has been deleted"
    }
    )
});

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
})