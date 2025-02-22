const express = require('express');
const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: {
        type: String
    },
    category:{
        type: String
    },
    costInRupees: {
        type: Number
    },
    description: {
        type: String
    },
    imageadd1: {
        type: String
    },
    imageadd2: {
        type: String
    },
    imageadd3: {
        type: String
    },
    rating: {
        type: Number
    },
    discount: {
        type: Number
    },
    isCart: {
        type: Number
    },
    longdescription: {
        type: String
    }
  });

  module.exports = mongoose.model("productSchema",productSchema);