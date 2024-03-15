// Destructure Router from express
const express = require("express")
const router = express.Router()
const UserController = require("../controllers/userController.js");
const  tryCatchHandler  = require('../utils/tryCatch.handler.js')


// Setting up the User signup/login routes
router.post("/signup", tryCatchHandler(UserController.createUser));

//Exporting the User Router
module.exports = router 