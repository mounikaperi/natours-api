const Review = require('../models/reviewModel');
const catchAsync = require('../utils/commonUtils');
const { HTTP_STATUS_CODES, HTTP_STATUS } = require('../utils/constants');

exports.getAllReviews = catchAsync(async (request, response, next) => {
  const reviews = await Review.find();
  response.status(HTTP_STATUS_CODES.SUCCESSFUL_RESPONSE.OK).json({
    status: HTTP_STATUS.SUCCESS,
    results: reviews.length,
    data: {
      reviews,
    },
  });
});

exports.createReview = catchAsync(async (request, response, next) => {
  const newReview = await Review.create(request.body);
  response.status(HTTP_STATUS_CODES.SUCCESSFUL_RESPONSE.CREATED).json({
    status: HTTP_STATUS.SUCCESS,
    data: {
      review: newReview,
    },
  });
});
