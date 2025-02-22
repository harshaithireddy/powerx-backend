const mongoose = require('mongoose');

const getTodayDate = () => {
    const today = new Date(Date.now());
    return new Date(today.toISOString().slice(0, 10));
};

const caloriesTakenSchema = new mongoose.Schema({
    foodName: {
        type: String,
        required: true,
    },
    type: {
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
    caloriesIntake: {
        type: Number,
        required: true,
    },
    consumedAt: {
        type: Date,
        default: Date.now,
    },
    todayDate: {
        type: Date,
        default: getTodayDate,
    },
});

module.exports = mongoose.model('CaloriesTaken', caloriesTakenSchema);