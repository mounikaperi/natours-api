const Review = require('../models/reviewModel');
const factoryHandler = require('../handlers/factoryHandler');

exports.setTourUserIds = (request, response, next) => {
  if (!request.body.tour) request.body.tour = request.params.tourId;
  if (!request.body.user) request.body.user = request.params.userId;
  next();
};

exports.getAllReviews = factoryHandler.getAll(Review);
exports.getReview = factoryHandler.getOne(Review);
exports.createReview = factoryHandler.createOne(Review);
exports.updateReview = factoryHandler.updateOne(Review);
exports.deleteReview = factoryHandler.deleteOne(Review);
