const express = require('express');
const mongoose = require('mongoose');

const LoginDetails = new mongoose.Schema({
    username : {
        type : String
    },
    password : {
        type : String
    }
});

module.exports = mongoose.model("LoginDetails", LoginDetails);