const express = require('express');
const Route = express.Router();

// const EntireController = require("../Controllers/FirstController");

const MailController = require("../Controllers/MailSender");

const ImageUploadController = require("../Controllers/Students");

const DietController = require("../Controllers/FoodController");

const ExerciseController = require("../Controllers/ExerciseController");

const YogaController = require('../Controllers/YogaController');

const productController = require('../Controllers/productController');

const AuthController = require("../Controllers/AuthController");

const WeightController = require("../Controllers/WeightController");

const OrderController = require("../Controllers/orderController");



// Route.get("/Testing-Api", EntireController.TEST); 

// Route.post("/Checking-User", EntireController.CHECKING_USER);


// Route.post("/add-data", EntireController.ADD_DATA);

// Route.get("/get-data", EntireController.GET_DATA);



// Route.post("/send-mail", MailController.MailSender);

// Route.post("/upload-image", ImageUploadController.FileUpload);


Route.post("/analyze-food", DietController.AnalyzeFoodWithAI);
Route.post("/save-ai-food", DietController.SaveAIFoodData);


Route.post("/add-diet-data", DietController.ADD_DIET_DATA);
Route.get("/get-all-diets", DietController.GET_ALL_DIETS);
Route.get("/get-all-diets/:foodName", DietController.GET_DIET_BY_NAME);

Route.post("/food-taken", DietController.CaloriesTakenController);
Route.delete("/delete-food", DietController.deleteCaloriesController);
Route.get("/Food-charts", DietController.GetFoodData);


Route.get("/get-exercises-data", ExerciseController.GET_EXERCISES);
Route.post("/add-exercise-data", ExerciseController.ADD_EXERCISES);
Route.get("/get-exercises-data/:exerciseName", ExerciseController.GET_EXERCISES_BY_NAME);

Route.post("/exercise-done",ExerciseController.EXERCISE_DONE)
Route.delete("/delete-data",ExerciseController.deleteExercise)
Route.get("/Exercise-charts", ExerciseController.GetExerciseData)

Route.post("/Weight-charts", WeightController.AddWeight);
Route.get("/Weight-charts", WeightController.GetWeightData);

Route.post('/add-yoga-poses', YogaController.ADD_YOGA_POSES);
Route.get('/get-all-yoga-poses', YogaController.GET_YOGA_POSES);
Route.get('/get-yoga-pose/:poseName', YogaController.GET_YOGA_POSE_BY_NAME);


Route.post("/prod-add", productController.dataADD); 
Route.get('/prod-get/:name', productController.getProductByName); 
Route.get('/prod-getid/:param', productController.getProductById); 
Route.patch("/cart-add", productController.addToCart); 
Route.patch("/cart-dec", productController.removeFromCart); 
Route.get("/prod-get", productController.dataGET); 
Route.get("/cart/:email", productController.getCartItems); 
Route.delete("/cart-remove", productController.removeCartItem);


Route.post("/checkout", OrderController.createOrder);
Route.get("/orders/:userEmail", OrderController.getUserOrders);

Route.post("/register", AuthController.signup);

Route.post("/verify-otp", AuthController.verifyOTP);

Route.post("/login", AuthController.login);

module.exports = Route;