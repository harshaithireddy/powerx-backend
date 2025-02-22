const mongoose = require("mongoose");



const OrderSchema = new mongoose.Schema({

    userEmail: { type: String, required: true },

    items: [

        {

            productId: { type: String, required: true },

            name: { type: String, required: true },

            quantity: { type: Number, required: true },

            price: { type: Number, required: true },

        },

    ],

    shippingAddress: { type: String, required: true },

    totalCost: { type: Number, required: true },

    datePlaced: { type: Date, default: Date.now, required: true }, // Added field for order date

});



module.exports = mongoose.model("Order", OrderSchema);

