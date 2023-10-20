const mongoose = require('mongoose');
const { TOUR_VALIDATION_ERRORS } = require('../utils/constants');

exports.tourSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, TOUR_VALIDATION_ERRORS.NAME],
      unique: true,
      trim: true,
      maxlength: [40, TOUR_VALIDATION_ERRORS.NAME_MAX_LENGTH],
      minlength: [10, TOUR_VALIDATION_ERRORS.NAME_MIN_LENGTH],
    },
    slug: String,
    duration: {
      type: Number,
      required: [true, TOUR_VALIDATION_ERRORS.DURATION],
    },
    maxGroupSize: {
      type: Number,
      required: [true, TOUR_VALIDATION_ERRORS.MAX_GROUP_SIZE],
    },
    difficulty: {
      type: String,
      required: [true, TOUR_VALIDATION_ERRORS.DIFFICULTY],
      enum: {
        values: ['easy', 'medium', 'difficult'],
        message: TOUR_VALIDATION_ERRORS.DIFFICULTY_LEVEL,
      },
    },
    ratingsAverage: {
      type: Number,
      default: 4.5,
      min: [1, TOUR_VALIDATION_ERRORS.RATING_MIN_VALUE],
      max: [5, TOUR_VALIDATION_ERRORS.RATING_MAX_VALUE],
    },
    ratingsQuantity: {
      type: Number,
      default: 0,
    },
    price: {
      type: Number,
      required: [true, TOUR_VALIDATION_ERRORS.PRICE],
    },
    priceDiscount: {
      type: Number,
      validate: function (val) {
        return val < this.price;
      },
      message: 'Discount price ({VALUE}) should be below regular price',
    },
    summary: {
      type: String,
      trim: true,
      required: [true, TOUR_VALIDATION_ERRORS.SUMMARY],
    },
    description: {
      type: String,
      trim: true,
    },
    imageCover: {
      type: String,
      required: [true, TOUR_VALIDATION_ERRORS.COVER_IMAGE],
    },
    images: [String],
    createdAt: {
      type: Date,
      default: Date.now(),
      select: false,
    },
    startDates: [Date],
    secretTour: {
      type: Boolean,
      default: false,
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);
