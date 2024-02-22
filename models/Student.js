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
		required: [true, 'Please enter a password'],
		minlength: [6, 'Password length should be minimum of 6 characters']
	},
	mobile: {
		type: String,
		required: true,
		validate: [isMobilePhone, 'Please enter a valid phone number']
	},
	avatar: {
		type: String
	},
	courses: {
		type: [Object]
	},
	live_session: {
		type: [Object]
	}

});


const Student = mongoose.model('Student', StudentSchema);

module.exports = Student;