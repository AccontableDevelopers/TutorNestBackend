const log = console.log;
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const ejs = require('ejs');
const cors = require('cors');
const fileUpload = require('express-fileupload');
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

//App Listen
app.listen(PORT, log(`Server run on PORT ${PORT}, Date: ${date}`));