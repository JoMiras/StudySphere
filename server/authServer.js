const express = require('express'); // Importing Express.js framework
const mongoose = require('mongoose'); // Importing Mongoose for MongoDB interactions
const bcrypt = require('bcryptjs'); // Importing bcrypt for password hashing
const bodyParser = require('body-parser'); // Middleware for parsing request bodies
const cors = require('cors'); // Middleware for enabling CORS
const jwt = require('jsonwebtoken');
const authenticateToken = require('./middleware/authMiddleware');
const nodemailer = require('nodemailer');
const twilio = require('twilio');
require('dotenv').config();
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const verifySid = process.env.TWILIO_VERIFY_SERVICE_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = new twilio(accountSid, authToken);
console.log(client);

const transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: 'fiendsauthentication@gmail.com',
    pass: process.env.EMAIL_PASS
  }
})

const EMAIL_SECRET = process.env.EMAIL_SECRET;

const app = express(); // Creating an Express application
app.use(cors()); // Using CORS middleware to enable cross-origin requests
app.use(bodyParser.json({ limit: '50mb' })); //had to increase the payload amount to accommodate the size of avatar photos

// Connect to MongoDB Atlas
mongoose.connect('mongodb+srv://frontendfiends:BVT123@studysphere.efmnucf.mongodb.net/?retryWrites=true&w=majority&appName=StudySphere', {
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
  profilePicture: String,
  role: {type: String, default: 'student'}, // Basic, Admin, SuperAdmin
  isEmailConfirmed: {type: Boolean, default: false} // Check if account has been confirmed with email verification
});

const User = mongoose.model('User', UserSchema); // Creating a User model based on the UserSchema

// Define Cohort Schema

const CohortSchema = new mongoose.Schema({
  cohortName: String,
  cohortSubject: String,
  adminID: String, // Auto set to _id of current user
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
  providerID: String, // Providers are like schools
  isLive: {type: Boolean, default: false} // Check if cohort has been approved by us to be live for users
})

const Cohort = mongoose.model('Cohort', CohortSchema); // Cohort model like the User model


// User Registration
app.post('/register', async (req, res) => {
  try {
    const { username, email,  phoneNumber, password, refreshToken, profilePicture, role, isEmailConfirmed} = req.body;
    const duplicateUser = await User.findOne({username});
    const existingEmail = await User.findOne({email}); // Checks if email exists in database
    //check for usernames in use
    if(duplicateUser) {
      return res.status(400).send('username already in use')}
    if (existingEmail) { // If user already exists, return error
      return res.status(400).send('Email already in use.');
    }
    
    const hashedPassword = await bcrypt.hash(password, 10); // Hash the password using bcrypt
    const newUser = new User({ username, email,  phoneNumber, password: hashedPassword, refreshToken, profilePicture, role, isEmailConfirmed}); // Create a new User document
    await newUser.save(); // Save the new user to the database

    // Setting up user for confirmation
    jwt.sign(
      {userId: newUser._id.toString()},
      EMAIL_SECRET,
      {expiresIn: '1d'}, // Token that expires in a day, special to each user
      (err, emailToken) =>{

        const url = `http://localhost:5173/confirmation/${emailToken}`; //Creating url for confirmation
    
        transporter.sendMail({
          to: newUser.email,
          subject: 'Welcome to Study Sphere!',
          html: `Click the following link to activate your account to use: <a href='${url}'>${url}</a>`
        });
      }
    );



    res.status(201).send('User registered successfully'); // Send success response
  } catch (error) {
    console.error('Error registering user:', error); // Log registration error
    res.status(500).send('Error registering user'); // Send error response
  }
});

//when user refreshes userAuth will check for refresh token/ update one if necessary and then return user data
app.post('/userData', authenticateToken, async (req, res) => {
  try {
    const { refreshToken } = req.body;
    const user = await User.findOne({ refreshToken });
    console.log(user)
    if (!user) {
      return res.status(404).send('User not found');
    }
    res.send(user);
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});

// Revised generateAccessToken function with longer expiry time
function generateAccessToken(user) {
    const payload = {
        id: user._id,
        username: user.username 
    };
    return jwt.sign(payload, "secret_value", { expiresIn: '60min' }); // Expires in 1 hour
};

// Revised /login endpoint with refreshToken
app.post('/login', async (req, res) => {
  try {
      const { username, password } = req.body;
      const user = await User.findOne({ username });
      if (!user) {
          return res.status(404).send('User not found');
      }
      if (!user.isEmailConfirmed) {
        return res.status(401).send('Please confirm email.') // If you haven't confirmed your email, do it
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

// Creating a cohort in the database
app.post('/newCohort', async (req, res) => {
  try {
    const { cohortName, cohortSubject, adminID, instructorID, dateRange, cohortFiles, providerID, isLive} = req.body;
    const existingCohort = await Cohort.findOne({ cohortName }); // Check if user already exists in the database
    if (existingCohort) { // If cohort already exists, return error
      return res.status(400).send('Cohort already exists');
    }
    const newCohort = new Cohort({ cohortName, cohortSubject, adminID, instructorID, dateRange, cohortFiles, providerID, isLive}); // Create a new User document
    await newCohort.save(); // Save the new cohort to the database
    res.status(201).send('Cohort successfully created'); // Send success response
  } catch (error) {
    console.error('Error creating cohort:', error); // Log registration error
    res.status(500).send('Error creating cohort'); // Send error response
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

app.post('/confirmation', async (req, res) => {
  try {
    const { token } = req.body;
    const decoded = jwt.verify(token, EMAIL_SECRET);
    console.log('test')

    const user = await User.findByIdAndUpdate(decoded.userId, {isEmailConfirmed: true}, {new: true});
    
    if (!user) {
      return res.status(404).send('User not found.');
    }

    res.send('Email has been confirmed.');
  } catch (err) {
    res.status(400).send('Invalid or expired Token');
  }
});

app.post('/verify/start', async (req, res) => {
  const { to } = req.body; // Extract the phone number from the request body
 
  try {
     // Initiate the verification process using Twilio's Verify API
     const verification = await client.verify.v2.services(verifySid)
       .verifications.create({ to, channel: 'sms' });
 
     // Log the verification object for debugging purposes
     console.log('Verification object:', verification);
       // Respond to the client with a success message
       res.status(200).send({ message: 'Verification code sent.', status: 'success' });
     } catch (error) {
     // Log the error for debugging purposes
     console.error('Error sending verification code:', error);
 
     // Respond to the client with an error message
     res.status(500).send({ message: 'Error sending verification code', error: error.message });
  }
 });

 app.post('/verify/check', async (req, res) => {
  const { to, code } = req.body;
  try {
    const verificationCheck = await client.verify.v2.services(verifySid)
      .verificationChecks
      .create({ to, code });

    if (verificationCheck.status === 'approved') {
      // Verification was successful
      res.status(200).send({ success: true, message: 'Verification successful' });
    } else {
      // Verification failed
      res.status(400).send({ success: false, message: 'Verification failed. Please try again.' });
    }
  } catch (error) {
    console.error('Verification error:', error);
    res.status(500).send({ success: false, message: 'Internal server error' });
  }
 });
 
//check username availability 
app.post('/checkUsername', async (req, res) => {
  console.log('ping')
  try {
    const { username } = req.body;
    const checkUsernameAvailability = await User.findOne({ username });
    if (checkUsernameAvailability) {
      res.send(false);
    } else {
      res.send(true);
    }
  } catch (error) {
    console.error('Error checking username availability:', error);
    res.status(500).send('Internal Server Error');
  }
});

//gets users for SuperAdmins 
app.get('/users', async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

//this endpoint will allow us to pass in a user to make a super admin
app.post('/make-super-admin', async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (user) {
      await User.updateOne({ email }, { $set: { role: 'SuperAdmin' } });
      res.status(201).send('User has been upgraded to SuperAdmin');
    } else {
      res.status(404).send('User not found');
    }
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});

const PORT = process.env.PORT || 4000; // Define port for the server to listen on
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`); // Log server start message
});

