const express = require("express")
const bodyParser = require("body-parser")
const { BadUserRequestError, NotFoundError } = require("../utils/errorHandlers.js")
const StudentUser = require("../models/Student.js")
const TutorUser = require("../models/Tutor.js")
const bcrypt = require("bcrypt")
require("dotenv").config()
const sendEmail = require("../services/nodemailer.js")

const app = express();

app.use(bodyParser.json())



class UserController {

    static async createStudent(req, res ) {
      const { name, email, password } = req.body;
      // Confirm  email has not been used by another user
      const existingUser = await StudentUser.findOne({ email });
      if (existingUser) {
      if (existingUser.isVerified) {
      throw new BadUserRequestError(`An account with ${email} already exists.`);
      } else if (existingUser.verifyEmailTokenExpire < Date.now()) {
      // Remove the existing user if the verification token has expired
      await StudentUser.deleteOne({ _id: existingUser._id });
      throw new BadUserRequestError('An error occured. Please try signing up again.')
      } else {
      throw new BadUserRequestError(`Please log in to ${email} to get your verification link.`);
      }
    }
      // Generate verification token
      const saltRounds = parseInt(process.env.bycrypt_salt_round)
      // Create verification token
      const verifyEmailToken = Math.floor(100000 + Math.random() * 900000).toString();
      // Hash password
      const hashedPassword =  await bcrypt.hash(password, 10);
      const user = new StudentUser ({
      name,
      email,
      password: hashedPassword,
      verifyEmailToken,
      verifyEmailTokenExpire: Date.now() + parseInt(process.env.token_expiry),
      });
     await user.save()
       // Set body of email
      const message = `Hi ${name}, Your verification code is: ${verifyEmailToken}` 
      const mailSent = await sendEmail({
          email: user.email,
          subject: 'Email verification',
          message
        })  
        if(mailSent === false) throw new NotFoundError(`${email} cannot be verified. Please provide a valid email address`)
        res.status(200).json({
          status: 'Success',
          message: `An email verification link has been sent to ${email}.`,
          message
        })
    }
    

    
    static async createTutor(req, res ) {
      const { name, email, password } = req.body;
      // Confirm  email has not been used by another user
      const existingUser = await TutorUser.findOne({ email });
      if (existingUser) {
      if (existingUser.isVerified) {
      throw new BadUserRequestError(`An account with ${email} already exists.`);
      } else if (existingUser.verifyEmailTokenExpire < Date.now()) {
      // Remove the existing user if the verification token has expired
      await TutorUser.deleteOne({ _id: existingUser._id });
      throw new BadUserRequestError('An error occured. Please try signing up again.')
      } else {
      throw new BadUserRequestError(`Please log in to ${email} to get your verification link.`);
      }
    }
      // Generate verification token
      const saltRounds = parseInt(process.env.bycrypt_salt_round)
      // Create verification token
      const verifyEmailToken = Math.floor(100000 + Math.random() * 900000).toString();
      // Hash password
      const hashedPassword =  await bcrypt.hash(password, 10);
      const user = new TutorUser ({
      name,
      email,
      password: hashedPassword,
      verifyEmailToken,
      verifyEmailTokenExpire: Date.now() + parseInt(process.env.token_expiry),
      });
     await user.save()
       // Set body of email
      const message = `Hi ${name}, Your verification code is: ${verifyEmailToken}` 
      const mailSent = await sendEmail({
          email: user.email,
          subject: 'Email verification',
          message
        })  
        if(mailSent === false) throw new NotFoundError(`${email} cannot be verified. Please provide a valid email address`)
        res.status(200).json({
          status: 'Success',
          message: `An email verification link has been sent to ${email}.`,
          message
        })
    }
    
}

//create new password for student
const createNewStudentPassword = async (payload) => {
  const { newStudentPassword } = payload;

  try {
      //find single student by id
      const foundStudent = await StudentUser.findById({ _id: payload._id })

      //if no student with id, return message to user
      if (!foundStudent) return "No user with provided id";

      //if found, check if passwords match, return information if it does
      if(foundStudent.password === newStudentPassword) return "New password is the same as the old one."

      //hash new student password
      const hashedStudentPassword = await bcrypt.hash(newStudentPassword, 10);

      //update the students password
      foundStudent.password = hashedStudentPassword;

      await foundStudent.save();

      console.log("Student password changed successfull!.")
      return "Password changed successfully!";

  } catch (error) {
      console.error(error);
      throw error;
  }
}
    

//create new password for tutors
const createNewTutorPassword = async (payload) => {
  const { newTutorPassword } = payload;

  try {
      //find single tutor by id
      const foundTutor = await TutorUser.findById({ _id: payload._id })

      //if no tutor, return information
      if (!foundTutor) return "No user with provided id";

      //if found , check if passwords match, return information if it does
      if (foundTutor.password === newTutorPassword) return "New password is the same as the old one."

      //hash new tutor password
      const hashedTutorPassword = await bcrypt.hash(newTutorPassword, 10);

      //update the tutors password
      foundTutor.password = hashedTutorPassword;

      await foundTutor.save();

      console.log("Tutor password changed successfull.")
      return "Password changed successfully!";

  } catch (error) {
      console.error(error);
      throw error;
  }
}


module.exports = {
  UserController,
  createNewStudentPassword,
  createNewTutorPassword
}