const express = require('express');
const DietModel = require("../Models/FoodModel");
const CaloriesTaken = require('../Models/FoodTaken');
const FoodTaken = require('../Models/FoodTaken');
const axios = require('axios');


// Add AI-based food calorie estimation
const AnalyzeFoodWithAI = async (req, res) => {
  const { food } = req.body;

  if (!food) {
    return res.status(400).json({ error: "Food description is required." });
  }

  try {
    const response = await axios.post(
      "https://api.openai.com/v1/chat/completions",
      {
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "user",
            content: `Estimate calories for: ${food}. Respond ONLY with the number, no text. Example: "300"`,
          },
        ],
        temperature: 0.3,
        max_tokens: 10,
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    // Debugging log to see the full OpenAI response
    console.log("Full OpenAI response:", response.data);

    // Extract AI response safely
    const aiResponse = response?.data?.choices?.[0]?.message?.content?.trim();
    if (!aiResponse) {
      return res.status(400).json({ error: "Invalid AI response." });
    }

    // Extract number from AI response
    const match = aiResponse.match(/\d+/);
    const calories = match ? parseInt(match[0]) : NaN;

    if (isNaN(calories)) {
      return res.status(400).json({ error: "Could not estimate calories." });
    }

    res.status(200).json({ food, calories });
  } catch (error) {
    console.error("OpenAI API error:", error);

    if (error.response?.status === 429) {
      return res.status(429).json({ error: "Rate limit exceeded. Try again later." });
    }

    res.status(500).json({ error: "Failed to analyze food with AI." });
  }
};

// Save AI-based food data to the database
const SaveAIFoodData = async (req, res) => {
  const { foodName, type, email, name, caloriesIntake } = req.body;

  if (!foodName || !caloriesIntake || !email || !name) {
    return res.status(400).json({ error: "All fields are required." });
  }

  try {
    // Check if the food entry already exists for today
    const todayDate = new Date().toISOString().slice(0, 10);
    const existingEntry = await FoodTaken.findOne({
      email,
      foodName,
      consumedAt: { $gte: todayDate },
    });

    if (existingEntry) {
      return res.status(409).json({ error: "Food entry already exists for today." });
    }

    // Save the new food entry
    const newFoodEntry = new FoodTaken({
      foodName,
      type,
      email,
      name,
      caloriesIntake,
      consumedAt: new Date().toISOString(),
      todayDate: new Date().toISOString()
    });

    await newFoodEntry.save();
    res
      .status(201)
      .json({ message: "Food entry saved successfully!", data: newFoodEntry });
  } catch (error) {
    console.error("Error saving AI food data:", error);
    res.status(500).json({ error: "Failed to save food data." });
  }
};




const AddDietData = async (req, res) => {
  const dietData = req.body;

  try {
    const result = await DietModel.insertMany(dietData);
    return res.status(201).json({ message: "Diet data added successfully!", result });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

const GetAllDiets = async (req, res) => {
  try {
    const diets = await DietModel.find({});
    return res.status(200).json(diets);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

const GetDietByName = async (req, res) => {
  const foodName = req.params.foodName;

  try {
    const diet = await DietModel.findOne({ name: foodName });

    if (!diet) {
      return res.status(404).json({ message: 'Food not found' });
    }

    return res.status(200).json(diet);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};


const CaloriesTakenController = async (req, res) => {
    const { foodName, type, email, name, caloriesIntake } = req.body;

    const getTodayDate = () => {
      const today = new Date(Date.now());
        return new Date(today.toISOString().slice(0, 10)); // Slice to get the date part (YYYY-MM-DD)
    };
  
    if (!foodName || !type || !email || !name || !caloriesIntake) {
        return res.status(400).json({ error: 'All fields are required' });
    }

    try {
        const todayDate = getTodayDate();
        const existingRecord = await CaloriesTaken.findOne({ email, name, foodName, todayDate });

        if (existingRecord) {
            return res.status(409).json({ error: 'Calories intake data for this food already exists for today' });
        }

        const newCaloriesTaken = new CaloriesTaken({
            foodName,
            type,
            email,
            name,
            caloriesIntake,
        });
        await newCaloriesTaken.save();

        return res.status(201).json({ message: 'Calories intake data saved successfully!' });
    } catch (error) {
        console.error('Error saving calories intake data:', error);
        return res.status(500).json({ error: 'Failed to save calories intake data' });
    }
};

const deleteCaloriesController = async (req, res) => {
  const { email, name, foodName } = req.body;

  const getTodayDate = () => {
    const today = new Date(Date.now());
    return new Date(today.toISOString().slice(0, 10));
};

  try {
      const todayDate = getTodayDate();

      const deletedCalories = await CaloriesTaken.findOneAndDelete({
          email,
          name,
          foodName,
          todayDate
      });

      if (!deletedCalories) {
          return res.status(404).json({ message: 'Calories intake entry not found' });
      }

      res.status(200).json({ message: 'Calories intake entry successfully deleted' });
  } catch (error) {
      console.error('Error deleting calories intake:', error);
      res.status(500).json({ message: 'Server error' });
  }
};


const GetFoodData = async (req, res) => {
  const userEmail = req.query.email;

  if (!userEmail) {
    return res.status(400).json({ error: 'Email is required.' });
  }

  try {
    const foodData = await FoodTaken.find({ email: userEmail });
    if (!foodData || foodData.length === 0) {
      console.log('No food data found for this user.');
      return res.status(404).json({ message: 'No food data found for this user.' });
    }

    res.status(200).json(foodData);
  } catch (error) {
    console.error('Error fetching food data:', error);
    res.status(500).json({ message: 'Failed to fetch food data due to server error.' });
  }
};



// Add the new functions to exports
exports.AnalyzeFoodWithAI = AnalyzeFoodWithAI;
exports.SaveAIFoodData = SaveAIFoodData;



exports.GET_DIET_BY_NAME = GetDietByName;

exports.ADD_DIET_DATA = AddDietData;
exports.GET_ALL_DIETS = GetAllDiets;

exports.CaloriesTakenController = CaloriesTakenController;
exports.deleteCaloriesController = deleteCaloriesController;

exports.GetFoodData = GetFoodData;