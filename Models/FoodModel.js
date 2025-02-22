const mongoose = require('mongoose');

// Define the schema for Indian Food Diet
const DietSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  benefits: {
    type: String,
  },
  steps: [
    {
      type: String,
    },
  ],
  svgImageUrl: {
    type: String,
  },
  kcalBurnt: {
    type: Number,
  },
  foodType: {
    type: String,
  },
});

// Export the model
module.exports = mongoose.model('IndianFoodDiet', DietSchema);
