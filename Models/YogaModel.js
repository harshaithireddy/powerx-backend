const mongoose = require('mongoose');

const YogaPoseSchema = new mongoose.Schema({
  id: {
    type: Number,
    required: true,
    unique: true,
  },
  english_name: {
    type: String,
    required: true,
  },
  sanskrit_name_adapted: {
    type: String,
    required: true,
  },
  sanskrit_name: {
    type: String,
    required: true,
  },
  translation_name: {
    type: String,
    required: true,
  },
  pose_description: {
    type: String,
    required: true,
  },
  pose_benefits: {
    type: String,
    required: true,
  },
  url_svg: {
    type: String,
    required: true,
  },
  url_png: {
    type: String,
    required: true,
  },
  url_svg_alt: {
    type: String,
  },
});


module.exports = mongoose.model('YogaPose', YogaPoseSchema);
