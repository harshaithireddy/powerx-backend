var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const bcrypt = require('bcryptjs');

var FirstRoute = require('./Routes/FirstRoute');

var cors = require('cors');

var mongoose = require('mongoose');

var bodyparser = require('body-parser');

require('dotenv').config(); // Load .env variables

// ✅ Connect to MongoDB
console.log("Mongo URI:", process.env.MONGO_URI);
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log("Connected to MongoDB!"))
.catch(err => console.error("MongoDB Connection Error:", err));

// ✅ Initialize Express App
var app = express();

// ✅ Apply CORS Middleware First (to prevent preflight issues)
app.use(cors());
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*'); // Allow all origins
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});

app.use(bodyparser.json()); // Parse JSON request bodies

// ✅ Middleware for parsing request bodies and static files
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// ✅ Define Routes
app.use("/", FirstRoute); // FirstRoute handles main API logic

// ✅ Route to Fetch Diet Data (Ensure `diets` is properly imported or fetched)
app.get('/get-all-diets/:foodName', (req, res) => {
  const foodName = req.params.foodName;
  const foodItem = diets.find(item => item.name === foodName);

  if (foodItem) {
    res.json(foodItem);
  } else {
    res.status(404).send('Food not found');
  }
});


// ✅ Handle 404 Errors
app.use(function(req, res, next) {
  next(createError(404));
});

// ✅ Error Handling Middleware (Fix res.render issue)
app.use(function(err, req, res, next) {
  // Set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // Render error response as JSON instead of using `res.render`
  res.status(err.status || 500).json({ error: err.message });
});

// ✅ Start Server
const PORT = process.env.PORT || 9000;
app.listen(PORT, function() {
  console.log('Server is running on port ' + PORT);
});

module.exports = app;
