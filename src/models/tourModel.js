const mongoose = require('mongoose');
const slugify = require('slugify');
const { tourSchema } = require('../schemas/tourSchema');

tourSchema.pre('save', function (next) {
  this.slug = slugify(this.name, { lower: true });
  next();
});

const Tour = mongoose.model('Tour', tourSchema);
module.exports = Tour;
