// Models/WeightModel.js
const mongoose = require("mongoose");

const WeightSchema = new mongoose.Schema(
  {
    email: { type: String, required: true },
    weight: { type: Number, required: true },
    date: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

const WeightModel = mongoose.model("Weight", WeightSchema);
module.exports = WeightModel;
