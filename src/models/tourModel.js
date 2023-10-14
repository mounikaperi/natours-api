const mongoose = require("mongoose");
const slugify = require("slugify");
const tourSchema = require("../schemas/tourSchema");

tourSchema.virtual("durationWeeks").get(() => tourSchema.duration / 7);
