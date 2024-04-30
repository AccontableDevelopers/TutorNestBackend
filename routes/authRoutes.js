const log = console.log;
const {Router} = require('express');
const router = Router();
const passport = require('passport');
require('../config/passport');
const AuthController = require("../controllers/authControllers.js");
const  tryCatchHandler  = require('../utils/tryCatch.handler.js')
// Google sign up
//router.get('/login/federated/google', passport.authenticate('google'));

router.get('/login', function(req, res) {
	res.render('login.ejs');
});

router.get('/loggedin', function(req, res) {
	res.render('success.ejs');
});

// Social Auth
// Google
router.get('/google',
  passport.authenticate('google', { scope:
      [ 'email', 'profile' ] }
));

router.get('/google/callback',
    passport.authenticate( 'google', {
        failureRedirect: '/auth/login',
        successRedirect: '/auth/loggedin'
}));

// Facebook
router.get('/facebook', passport.authenticate('facebook', { scope: 'email' }));

router.get('/facebook/callback',
    passport.authenticate( 'facebook', {
        failureRedirect: '/auth/login',
        successRedirect: '/auth/loggedin'
}));





// Setting up the User signup/login routes
router.post("/student/signup", tryCatchHandler(AuthController.createStudent));
router.post("/tutor/signup", tryCatchHandler(AuthController.createTutor));
router.get("/student/verifyOtp",tryCatchHandler(AuthController.verifyOtp))
router.post("/student/resetOtp",tryCatchHandler(AuthController.resetOtpCode))
router.post("/student/login",tryCatchHandler(AuthController.login))
router.post("student/resetPassword",tryCatchHandler(AuthController.resetPassword))
router.post("student/newPassword",tryCatchHandler(AuthController.createNewPassword))


module.exports = router;