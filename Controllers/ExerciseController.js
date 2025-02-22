const express = require('express');
const ExerciseModel = require('../Models/ExercisesModel');
const ExerciseDone = require('../Models/ExerciseDone');

const AddExercises = async (req, res) => {
    const exerciseData = req.body;
    try {
        const result = await ExerciseModel.insertMany(exerciseData);
        return res.status(201).json({ message: "Exercises added successfully!", result });
    }
    catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

const GetExercises = async (req, res) => {
    try {
        const result = await ExerciseModel.find({});
        return res.status(200).json(result);
    }
    catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

const GetExercisesByName = async (req, res) => {
    const exerciseName = req.params.exerciseName;
    try {
        const exercise = await ExerciseModel.findOne({ name: exerciseName });
        if(!exercise) {
            return res.status(404).json({ message: 'Exercise not found' });
        }
        return res.status(200).json(exercise);
    }
    catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

const ExerciseDoneController = async (req, res) => {
    const { cardname, email, name, caloriesBurnt } = req.body;

    const getTodayDate = () => {
        const today = new Date(Date.now());
        return new Date(today.toISOString().slice(0, 10));
    };

    if (!cardname || !email || !name || !caloriesBurnt) {
        return res.status(400).json({ error: 'All fields are required' });
    }

    try {
        const todayDate = getTodayDate();

        const existingRecord = await ExerciseDone.findOne({ email, name, cardname, todayDate });
        if (existingRecord) {
            return res.status(409).json({ error: 'Exercise data already exists for today' }); // Conflict status
        }

        const newExerciseDone = new ExerciseDone({
            cardname,
            email,
            name,
            caloriesBurnt,
            date: todayDate,
        });
        await newExerciseDone.save();

        return res.status(201).json({ message: 'Exercise data saved successfully!' });
    } catch (error) {
        console.error('Error saving exercise data:', error);
        return res.status(500).json({ error: 'Failed to save exercise data' });
    }
};


const deleteExerciseController = async (req, res) => {
    const { email, username, cardname } = req.body;
    
    const getTodayDate = () => {
        const today = new Date(Date.now());
        return new Date(today.toISOString().slice(0, 10));
    };

    try {
        const deletedExercise = await ExerciseDone.findOneAndDelete({
            email: email,
            name: username,
            cardname: cardname,
            todayDate: getTodayDate(),
        });

        if (!deletedExercise) {
            return res.status(404).json({ message: 'Exercise entry not found' });
        }

        res.status(200).json({ message: 'Exercise entry successfully deleted' });
    } catch (error) {
        console.error('Error deleting exercise:', error);
        res.status(500).json({ message: 'Server error' });
    }
};


const GetExerciseData = async (req, res) => {
    const userEmail = req.query.email;
    if (!userEmail) {
      return res.status(400).json({ error: 'Email is required.' });
    }
  
    try {
      const exerciseData = await ExerciseDone.find({ email: userEmail });
  
      if (!exerciseData || exerciseData.length === 0) {
        console.log('No exercise data found for this user.');
        return res.status(404).json({ message: 'No exercise data found for this user.' });
      }
  
      res.status(200).json(exerciseData);
    } catch (error) {
      console.error('Error fetching exercise data:', error);
      res.status(500).json({ message: 'Failed to fetch exercise data due to server error.' });
    }
  };
  

  
  
  

exports.ADD_EXERCISES = AddExercises;
exports.GET_EXERCISES = GetExercises;
exports.GET_EXERCISES_BY_NAME = GetExercisesByName;
exports.EXERCISE_DONE = ExerciseDoneController;
exports.deleteExercise=deleteExerciseController;
exports.GetExerciseData=GetExerciseData;