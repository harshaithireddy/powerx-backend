const express = require('express');

const MyDB = require("../Models/FirstModel");

const Testing = async(req, res) => {
    return res.status(200).json("Working Fine");
}


const CheckingUser = async(req, res) => {
    var { name, password } = req.body;
    var data = [
        {
            "username" : name,
            "password" : password
        }
    ]
    console.log(data);
    MyDB.insertMany(data)
    .then(result => {
        return res.status(201).json("Added Successfully!");
    })
    .catch(err=> {
        return res.status(500).json({ message: err.message });
    })
}




const DataBase = async(req, res) => {
    var data = req.body;
    MyDB.insertMany(data)
    .then(result => {
        return res.status(201).json("Added Successfully!");
    })
    .catch(err=> {
        return res.status(500).json({ message: err.message });
    })
}



const GetData = async(req, res) => {
    MyDB.find({"username" : "harsha"})
   .then(result => {
    return res.status(200).json(result)
   })
   .catch(err=> {
    return res.status(500).json({ message: err.message });
   })
}


exports.CHECKING_USER = CheckingUser;
exports.TEST = Testing;

exports.ADD_DATA = DataBase;


exports.GET_DATA = GetData;
