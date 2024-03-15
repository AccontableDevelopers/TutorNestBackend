
const { BadUserRequestError, NotFoundError } = require("../errors/error.js")
const User = require("../models/Student.js")
const bcrypt = require("bcrypt")
require("dotenv").config()
const sendEmail = require("../utils/sendEmail.js")



class UserController {

    static async createUser(req, res ) {
      const { name, email, password } = req.body;
      // Confirm  email has not been used by another user
      const existingUser = await User.findOne({ email });
      if (existingUser) {
      if (existingUser.isVerified) {
      throw new BadUserRequestError(`An account with ${email} already exists.`);
      } else if (existingUser.verifyEmailTokenExpire < Date.now()) {
      // Remove the existing user if the verification token has expired
      await User.deleteOne({ _id: existingUser._id });
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
     
      const user = new User ({
      name,
      email,
      password: hashedPassword,
      verifyEmailToken,
      verifyEmailTokenExpire: Date.now() + parseInt(process.env.token_expiry),
      });
      
     await user.save()
       // Set body of email
      const message = `Hi ${name}, Your verification code is: ${verifyEmailToken}`
      console.log('here',user.email,message)
      const mailSent = await sendEmail({
          email: user.email,
          subject: 'Email verification',
          message
        })
        console.log('here',mailSent)
        if(mailSent === false) throw new NotFoundError(`${email} cannot be verified. Please provide a valid email address`)
        res.status(200).json({
          status: 'Success',
          message: `An email verification link has been sent to ${email}.`,
          message
        })
    }
    
}
    
  module.exports = UserController