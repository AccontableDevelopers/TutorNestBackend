const log = console.log;
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const {	isEmail, isMobilePhone	} = require('validator');

const TutorSchema = new mongoose.Schema({
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
	identification_type: {
		type: String,
		required: true,
		enum: {
			values: ["Driver's license", "National Identification Card", "International Passport", "Voter's Card"],
			message: 'Not an acceptable means of identification'
		},
	},
	identification_document: {
		type: String,
		required: true
	},
	identification_number: {
		type: String,
		required: true
	},
	tutor_bio: {
		type: String
	},
	avatar: {
		type: String
	}
	areas_of_expertise: {
		type: [String],
		required: true
	},
	tutor_reviews: {
		type: [String]
	},
	avg_tutor_rating: {
		type: Number
	},
	courses: {
		type: [Object]
	},
	live_session: {
		type: [Object]
	}

});


const Tutor = mongoose.model('Tutor', TutorSchema);

module.exports = Tutor;