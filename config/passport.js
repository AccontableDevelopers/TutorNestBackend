const log = console.log;
const passport = require('passport');
//const googleStrategy = require('passport-google-oidc');
const facebookStrategy = require( 'passport-facebook' ).Strategy;
const googleStrategy = require( 'passport-google-oauth2' ).Strategy;
const Student = require('../models/Student.js');

// Google Auth
passport.use(new googleStrategy({
	  clientID: process.env['GOOGLE_CLIENT_ID'],
	  clientSecret: process.env['GOOGLE_CLIENT_SECRET'],
	  callbackURL: 'http://localhost:2000/auth/google/callback',
	  scope: [ 'profile' ]
	}, 
	async function verify(accessToken, refreshToken, profile, done) {
		log(accessToken, profile);
		//log(accessToken);
		try {
			const foundStudent = await Student.findOne({ social_id: profile.id, auth_client: "Google" });
			if (!foundStudent) {
				const newStudent = await new Student({
					name: profile.displayName,
					email: profile.email,
					auth_type: "Social",
					auth_client: "Google",
					social_id: profile.id,
					avatar: profile.picture
				});

				newStudent.save();
				log('new account');
				done(null, newStudent);
			} else {
				log('returnee account');
				done(null, foundStudent);
			}
		} catch(err) {
			done(err, null);
		}
	}
));

// Facebook Auth
passport.use(new facebookStrategy({
	  clientID: process.env['FACEBOOK_APP_ID'],
	  clientSecret: process.env['FACEBOOK_APP_SECRET'],
	  callbackURL: 'http://localhost:2000/auth/facebook/callback',
	  scope: [ 'profile' ]
	}, 
	async function verify(accessToken, refreshToken, profile, done) {
		log(accessToken, profile);
		//log(accessToken);
		try {
			const foundStudent = await Student.findOne({ social_id: profile.id, auth_client: "Facebook" });
			if (!foundStudent) {
				const newStudent = await new Student({
					name: profile.displayName,
					email: profile.email,
					auth_type: "Social",
					auth_client: "Facebook",
					social_id: profile.id,
					avatar: profile.picture
				});

				newStudent.save();
				log('new account');
				done(null, newStudent);
			} else {
				log('returnee account');
				done(null, foundStudent);
			}
		} catch(err) {
			done(err, null);
		}
	}
));

// Twitter Auth

// Persist user data in session
passport.serializeUser(function (user, done) {
	done(null, user.id);
});

// Fetch session details using session id
passport.deserializeUser(async function (id, done) {
	const studentUser = await Student.findById(id);
	done(studentUser);
});