const WeightModel = require('../Models/WeightModel');

const AddWeight = async (req, res) => {
    const { email, weight } = req.body;

    // Validate the request
    if (!email || weight == null) {
        return res.status(400).json({ error: 'Email and weight are required' });
    }

    try {
        // Create a new weight record
        const newWeight = new WeightModel({ email, weight });
        await newWeight.save();

        return res.status(201).json({ message: 'Weight logged successfully!', newWeight });
    } catch (error) {
        console.error('Error logging weight:', error);
        return res.status(500).json({ message: 'Failed to log weight' });
    }
};

const GetWeightData = async (req, res) => {
    const userEmail = req.query.email;

    // Validate email
    if (!userEmail) {
        return res.status(400).json({ error: 'Email is required.' });
    }

    try {
        // Fetch weight data from the database
        const weightData = await WeightModel.find({ email: userEmail }).sort({ date: -1 });

        // Return the found data, even if it’s an empty array
        res.status(200).json(weightData);
    } catch (error) {
        console.error('Error fetching weight data:', error);
        res.status(500).json({ message: 'Failed to fetch weight data due to server error.' });
    }
};

exports.AddWeight = AddWeight;
exports.GetWeightData = GetWeightData;
