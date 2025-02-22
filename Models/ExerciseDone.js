const mongoose = require('mongoose');

// Helper function to store only the date part (without time)
const getTodayDate = () => {
    const today = new Date(Date.now());
    return new Date(today.toISOString().slice(0, 10)); // Slice to get the date part (YYYY-MM-DD)
};

const exerciseDoneSchema = new mongoose.Schema({
    cardname: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    caloriesBurnt: {
        type: Number,
        required: true,
    },
    completedAt: {
        type: Date,
        default: Date.now, // Keep track of when the exercise was done (with time)
    },
    todayDate: {
        type: Date,
        default: getTodayDate, // Store only the date part
    },
});

module.exports = mongoose.model('ExerciseDone', exerciseDoneSchema);