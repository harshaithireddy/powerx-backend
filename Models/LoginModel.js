// models/LoginModel.js
const mongoose = require('mongoose');

const LoginDataDetails = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    otp: {
        type: String
    },
    isVerified: {
        type: Boolean,
        default: false
    }
});

module.exports = mongoose.model("LoginDataDetails", LoginDataDetails);
