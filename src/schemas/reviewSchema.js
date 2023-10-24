const mongoose = require('mongoose');
const { REVIEW_SCHEMA_VALIDATION_ERRORS } = require('../utils/constants');

exports.reviewSchema = mongoose.Schema(
  {
    review: {
      type: String,
      required: [true, REVIEW_SCHEMA_VALIDATION_ERRORS.NO_REVIEW],
    },
    rating: {
      type: Number,
      min: 1,
      max: 5,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    tour: {
      type: mongoose.Schema.ObjectId,
      ref: 'Tour',
      required: [true, REVIEW_SCHEMA_VALIDATION_ERRORS.TOUR_REVIEW],
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: [true, REVIEW_SCHEMA_VALIDATION_ERRORS.USER_REVIEW],
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);
