const mongoose = require("mongoose");
const tourSchema = require("../schemas/tourSchema");

tourSchema.virtual("durationWeeks").get(() => tourSchema.duration / 7);

const Tour = mongoose.model("Tour", tourSchema);

module.exports = Tour;
