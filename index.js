const log = console.log;
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const ejs = require('ejs');
const cors = require('cors');
const fileUpload = require('express-fileupload');
const session = require('express-session');
const mongoStore = require('connect-mongo');
const connectDB = require('./config/db');
const date = new Date();
const PORT = process.env['PORT'] || 8000;

// Env variables
require('dotenv').config();

const app = express();

// CORS Config
app.use(cors({
    origin: "*"
}));

// Body parser middleware
app.use(bodyParser.urlencoded({ extended: false }));

//Sessions
app.use(session({
    secret: process.env.MYTOKEN,
    resave: false,
    saveUninitialized: true,
    store: mongoStore.create({ mongoUrl: process.env.LIVE_DATABASE_URI, collectionName: "sessions" }),
    cookie: {
        maxAge: Number(process.env.MAXAGE)
    }
}));

// File Upload
app.use(fileUpload({
    useTempFiles: true,
    limits: {limits: 50 * 2024 * 1024}
}));


// Middlewares
app.use(express.json());
app.use(cookieParser());


// Database connection
connectDB();

// View engine
app.set('views', (__dirname + '/views'));
app.set('view engine', 'ejs');

// Routes
app.use('/auth', require('./routes/authRoutes'));
app.use('/user', require('./routes/userRoutes'))
//LIVE_DATABASE_URI = mongodb+srv://AccountabilityGroup:bxHJ6NTIiSNX9Np0@cluster0.fhzuao4.mongodb.net/TutorNest?retryWrites=true&w=majority&appName=Cluster0

//App Listen
app.listen(PORT, log(`Server run on PORT ${PORT}, Date: ${date}`));