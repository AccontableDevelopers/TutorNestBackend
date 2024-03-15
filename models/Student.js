const log = console.log;
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const {	isEmail, isMobilePhone	} = require('validator');

const StudentSchema = new mongoose.Schema({
	name: {
		type: String,
		required: true
	},
	email: {
		type: String,
		required: true,
		validate: [isEmail, 'Please enter a valid email address']
	},
	password: {
		type: String,
		minlength: [6, 'Password length should be minimum of 6 characters']
	},
	isVerified: {
		type: Boolean,
		default: false,
	  },
	refreshToken:{
		type:String,
		default:null
	  },
	mobile: {
		type: String,
		validate: [isMobilePhone, 'Please enter a valid phone number']
	},
	avatar: {
		type: String
	},
	auth_type: {
		type: String,
		enum: {
			values: ['Native', 'Social'],
			message: 'Not an acceptable authentication method'
		}
	},
	auth_client: {
		type: String
	},
	social_id: {
		type: String
	},
	courses: {
		type: [Object]
	},
	live_session: {
		type: [Object]
	},
	verifyEmailToken: String,
  	verifyEmailTokenExpire: Date,
  	resetPasswordToken: String,
  	resetPasswordExpire: Date

});


const Student = mongoose.model('Student', StudentSchema);

module.exports = Student;