const express = require('express');
const YogaPoseModel = require('../Models/YogaModel')

const AddYogaPoses = async (req, res) => {
    const yogaData = req.body;
    try {
        const result = await YogaPoseModel.insertMany(yogaData);
        return res.status(201).json({ message: "Yoga poses added successfully!", result });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

const GetYogaPoses = async (req, res) => {
    try {
        const result = await YogaPoseModel.find({});
        return res.status(200).json(result);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

const GetYogaPoseByName = async (req, res) => {
    const englishName = req.params.poseName;
    try {
        const yogaPose = await YogaPoseModel.findOne({ english_name: englishName });
        if (!yogaPose) {
            return res.status(404).json({ message: 'Yoga pose not found' });
        }
        return res.status(200).json(yogaPose);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

exports.ADD_YOGA_POSES = AddYogaPoses;
exports.GET_YOGA_POSES = GetYogaPoses;
exports.GET_YOGA_POSE_BY_NAME = GetYogaPoseByName;
