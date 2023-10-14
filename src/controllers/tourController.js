/* eslint-disable prettier/prettier */
const Tour = require("../models/tourModel");
const { HTTP_STATUS_CODES, HTTP_STATUS } = require("../utils/constants");

exports.getAllTours = async (request, response) => {
  try {
    const tours = Tour.find();
    response
      .status(HTTP_STATUS_CODES.SUCCESSFUL_RESPONSE.OK)
      .json({
        status: HTTP_STATUS.SUCCESS,
        totalNumberOfTours: tours.length,
        data: { tours }
      }
      );
  } catch (error) {
    response
      .status(HTTP_STATUS_CODES.CLIENT_ERROR_RESPONSE.NOT_FOUND)
      .json({
        status: HTTP_STATUS.FAIL,
        message: error
      });
  }
}

exports.getTour = async (request, response) => {
  try {
    const { params } = request || {};
    const { id: tourId } = params || {};
    const tour = await Tour.find(tourId);
    response
      .status(HTTP_STATUS_CODES.SUCCESSFUL_RESPONSE.OK)
      .json({
        status: HTTP_STATUS.SUCCESS,
        data: { tour }
      }
      );
  } catch (error) {
    response
      .status(HTTP_STATUS_CODES.CLIENT_ERROR_RESPONSE.NOT_FOUND)
      .json({
        status: HTTP_STATUS.FAIL,
        message: error
      }
      );
  }
};

exports.createTour = async (request, response) => {
  try {
    const newTour = await Tour.create(request.body);
    response
      .status(HTTP_STATUS_CODES.SUCCESSFUL_RESPONSE.CREATED)
      .json({
        status: HTTP_STATUS.SUCCESS,
        data: {
          tour: newTour
        }
      });
  } catch (error) {
    response
      .status(HTTP_STATUS_CODES.CLIENT_ERROR_RESPONSE.BAD_REQUEST)
      .json({
        status: HTTP_STATUS.FAIL,
        message: error
      })
  }
};

exports.updateTour = async (request, response) => {
  try {
    const { params, body } = request || {};
    const { id: tourId } = params || {};
    const updatedTour = await Tour.findByIdAndUpdate(tourId, body, {
      new: true,
      runValidators: true
    })
    response
      .status(HTTP_STATUS_CODES.SUCCESSFUL_RESPONSE.OK)
      .json({
        status: HTTP_STATUS.SUCCESS,
        data: {
          updatedTour
        }
      }
      );
  } catch (error) {
    response
      .status(HTTP_STATUS_CODES.CLIENT_ERROR_RESPONSE.NOT_FOUND)
      .json({
        status: HTTP_STATUS.FAIL,
        message: error
      }
      )
  }
}

exports.deleteTour = async (request, response) => {
  try {
    await Tour.findByIdAndDelete(request.params.id);
    response
      .status(HTTP_STATUS_CODES.SUCCESSFUL_RESPONSE.NO_CONTENT)
      .json({
        status: HTTP_STATUS.SUCCESS,
        message: "The tour has been deleted"
      }
      )
  } catch (error) {
    response
      .status(HTTP_STATUS_CODES.CLIENT_ERROR_RESPONSE.NOT_FOUND)
      .json({
        status: HTTP_STATUS.FAIL,
        message: error
      }
      )
  }
}