const mongoose = require('mongoose');
const Tour = require('./tourModel');
const reviewSchema = require('../schemas/reviewSchema');

reviewSchema.index({ tour: 1, user: 1 }, { unique: true });

reviewSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'user',
    select: 'name photo',
  });
  next();
});

reviewSchema.statics.calcAverageRatings = async function (tourId) {
  const stats = await this.aggregate([
    {
      $match: { tour: tourId },
    },
    {
      $group: {
        _id: '$tour',
        nRating: { $sum: 1 },
        avgRating: { $avg: '$rating' },
      },
    },
  ]);
  let ratingsQuantity = 0;
  let ratingsAverage = 0;
  if (stats.length > 0) {
    ratingsQuantity = stats[0].nRating ? stats[0].nRating : 0;
    ratingsAverage = stats[0].avgRating ? stats[0].avgRating : 0;
  }
  await Tour.findByIdAndUpdate(tourId, {
    ratingsQuantity,
    ratingsAverage,
  });
};

reviewSchema.post('save', function () {
  // this points to the current review
  this.constructor.calcAverageRatings(this.tour);
});

// To handle findOneAndUpdate and findOneAndDelete
reviewSchema.pre(/^findOneAnd/, async function (next) {
  this.rating = await this.findOne();
  next();
});

reviewSchema.post(/^findOneAnd/, async function () {
  // await this.findOne(); does NOT work here, query has already executed
  await this.rating.constructor.calcAverageRatings(this.r.tour);
});

const Review = mongoose.model('Review', reviewSchema);

module.exports = Review;
