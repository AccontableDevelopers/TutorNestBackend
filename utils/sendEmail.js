const nodemailer = require("nodemailer");
require('dotenv').config()


const sendEmail = async (options) => {
  
  const transporter = nodemailer.createTransport({
    service: process.env.NODEMAILER_SERVIC,
    auth: {
      user: process.env.NODEMAILER_USER, 
      pass: process.env.NODEMAILER_PASS, 
    },
  });

  // send mail with defined transport object
  const message = {
    from:  `"TutorNest" <${process.env.from_email}>`,
    to: options.email,
    subject: options.subject,
    text: options.message
  }; 

  const info = await transporter.sendMail(message);
  console.log(info)
}


module.exports = sendEmail