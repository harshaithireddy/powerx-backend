const mongoose = require('mongoose');

// Define the schema for Exercises
const ExerciseSchema = new mongoose.Schema({
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
  targetMuscle: {
    type: String,
    required: true,
  },
  sets: {
    type: Number,
    required: true,
  },
  reps: {
    type: String,
    required: true,
  },
  caloriesBurnt: {
    type: Number,
    required: true,
  },
  exercisetype: {
    type: String,
    required: true,
  },
  benefits: {
    type: String,
  },
  steps: [
    {
      type: String,
    },
  ],
  description: {
    type: String,
  },
  gifImageUrl: {
    type: String,
  },
});

// Export the model
module.exports = mongoose.model('Exercise', ExerciseSchema);
