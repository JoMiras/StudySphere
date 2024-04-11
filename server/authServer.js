const express = require('express'); // Importing Express.js framework
const mongoose = require('mongoose'); // Importing Mongoose for MongoDB interactions
const bcrypt = require('bcryptjs'); // Importing bcrypt for password hashing
const bodyParser = require('body-parser'); // Middleware for parsing request bodies
const cors = require('cors'); // Middleware for enabling CORS
const jwt = require('jsonwebtoken');


const app = express(); // Creating an Express application
app.use(cors()); // Using CORS middleware to enable cross-origin requests
app.use(bodyParser.json({ limit: '50mb' }));

// Connect to MongoDB Atlas
mongoose.connect('mongodb+srv://frontendfiends:6lCbNr0xOdhPlIYw@studysphere.efmnucf.mongodb.net/?retryWrites=true&w=majority&appName=StudySphere', {
  useNewUrlParser: true, // MongoDB connection options
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected')) // Log successful MongoDB connection
.catch(err => console.error('MongoDB connection error:', err)); // Log MongoDB connection error

// Define User Schema
const UserSchema = new mongoose.Schema({
  username: String, // Define username field as String
  password: String, // Define password field as String
  refreshToken: { type: String, default: '' },
  email: String,
  phoneNumber: String,
  profilePicture: String
});

const User = mongoose.model('User', UserSchema); // Creating a User model based on the UserSchema

// Define Cohort Schema

const CohortSchema = new mongoose.Schema({
  cohortName: String,
  adminID: String,
  instructorID: String,
  dateRange: {
    startDate: Date,
    endDate: Date
  },
  cohortFiles: {
    readingMaterial: Array,
    assignments: Array,
    tests: Array
  },
  providerID: String,
  isLive: Boolean
})

const Cohort = mongoose.model('Cohort', CohortSchema); // Cohort model like the User model


// User Registration
app.post('/register', async (req, res) => {
  try {
    const { username, email,  phoneNumber, password, refreshToken, profilePicture} = req.body;
    const existingUser = await User.findOne({ email }); // Check if user already exists in the database
    if (existingUser) { // If user already exists, return error
      return res.status(400).send('User already exists');
    }
    const hashedPassword = await bcrypt.hash(password, 10); // Hash the password using bcrypt
    const newUser = new User({ username, email,  phoneNumber, password: hashedPassword, refreshToken, profilePicture}); // Create a new User document
    await newUser.save(); // Save the new user to the database
    res.status(201).send('User registered successfully'); // Send success response
  } catch (error) {
    console.error('Error registering user:', error); // Log registration error
    res.status(500).send('Error registering user'); // Send error response
  }
});

// Revised generateAccessToken function with longer expiry time
function generateAccessToken(user) {
    const payload = {
        id: user._id,
        username: user.username 
    };
    return jwt.sign(payload, "secret_value", { expiresIn: '15min' }); // Expires in 15 minutes
};


// Revised /login endpoint with refreshToken
app.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(404).send('User not found');
        }
        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) {
            return res.status(401).send('Invalid password');
        }
        const accessToken = generateAccessToken(user.toObject());
        const refreshToken = jwt.sign({ id: user._id }, "secret_value"); // Only store user id in refresh token
        await User.updateOne({ _id: user._id }, { $set: { refreshToken: refreshToken } }); // Update refreshToken field
        res.json({ accessToken, refreshToken, user });
    } catch (error) {
        console.error('Error logging in:', error);
        res.status(500).send('Error logging in');
    }
});

// Refresh token endpoint
app.post('/refresh-token', async (req, res) => {
    const { refreshToken } = req.body;
    if (!refreshToken) {
        return res.status(401).send('Refresh token not provided');
    }
    try {
        const decoded = jwt.verify(refreshToken, "secret_value");
        console.log(decoded)
        const user = await User.findById(decoded.id);
        if (!user) {
            return res.status(404).send('User not found');
        }
        const newAccessToken = generateAccessToken(user.toObject());
        res.json({ accessToken: newAccessToken });
    } catch (error) {
        console.error('Error refreshing token:', error);
        res.status(401).send('Invalid refresh token');
    }
});


// Creating a cohort in the database
app.post('/newCohort', async (req, res) => {
  try {
    const { cohortName, adminID, instructorID, dateRange, cohortFiles, providerID, isLive} = req.body;
    const existingCohort = await User.findOne({ cohortName }); // Check if user already exists in the database
    if (existingCohort) { // If cohort already exists, return error
      return res.status(400).send('Cohort already exists');
    }
    const newCohort = new Cohort({ cohortName, adminID, instructorID, dateRange, cohortFiles, providerID, isLive}); // Create a new User document
    await newCohort.save(); // Save the new cohort to the database
    res.status(201).send('Cohort successfully created'); // Send success response
  } catch (error) {
    console.error('Error creating cohort:', error); // Log registration error
    res.status(500).send('Error creating cohort'); // Send error response
  }
});


const PORT = process.env.PORT || 4000; // Define port for the server to listen on
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`); // Log server start message
});
