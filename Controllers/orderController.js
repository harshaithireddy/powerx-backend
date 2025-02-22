const Order = require("../Models/Order");



exports.createOrder = async (req, res) => {

    const { userEmail, items, shippingAddress, totalCost } = req.body;



    // Basic validation

    if (!userEmail || !items || !shippingAddress || !totalCost) {

        return res.status(400).json({ message: "All fields are required." });

    }



    const newOrder = new Order({

        userEmail,

        items,

        shippingAddress,

        totalCost,

        // datePlaced is automatically set by Mongoose using the default value

    });



    try {

        const savedOrder = await newOrder.save();

        res.status(201).json(savedOrder);

    } catch (error) {

        console.error("Error saving order:", error); // Log error for debugging

        res.status(500).json({ message: "Failed to create order. Please try again." });

    }

};



exports.getUserOrders = async (req, res) => {

    try {

        const orders = await Order.find({ userEmail: req.params.userEmail });

        return res.status(200).json(orders); // Send back the array of orders

    } catch (error) {

        console.error("Error fetching orders:", error);

        res.status(500).json({ message: "Internal server error" });

    }

};