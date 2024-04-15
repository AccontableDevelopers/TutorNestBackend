
const { BadUserRequestError, NotFoundError } = require("../utils/errorHandlers.js")
const StudentUser = require("../models/Student.js")
const TutorUser = require("../models/Tutor.js")
const bcrypt = require("bcrypt")
require("dotenv").config()
const sendEmail = require("../services/nodemailer.js")
const { accessToken, refreshToken } = require("../utils/helpers.js")



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
      const verifyEmailToken = Math.floor(100000 + Math.random() * 900000).toString();                                                                                                                                                                                                                         Math.floor(100000 + Math.random() * 900000).toString();
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
    static async verifyOtp (req,res) {
      const {otpCode,email} = req.body
      const user = await UserController.findOne({
        email,
        verifyEmailToken:otpCode,
        verifyEmailTokenExpire:{$gt:Date.now()}
      })
      if(!user) return NotFoundError("otp not found, please otp")
      user.isVerified = true;
      verifyEmailToken = undefined;
      verifyEmailTokenExpire = undefined
      await user.save()
      const userToken = accessToken(user)
      const refresh = refreshToken(user)
      user.refresh = refresh
      await user.save()
      const maxAge = parseInt(process.env.MAX_AGE)
      res.cookie("refresh_token",refresh,{
        httpOnly: true,
        samesite: "none",
        secure:false,
        maxAge
      })
      res.status(201).json({
        status:"sucess",
        message:"account activation successful",
        data:{
          user,
          access_token:userToken
        }
      })
    }
}
    
  module.exports = UserController