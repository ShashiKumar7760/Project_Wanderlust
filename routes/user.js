const express = require('express');
const router = express.Router();
const passport = require('passport');
const {saveUrl} = require('../middleware.js');
const UserController = require('../controllers/user.js');


router.route('/signup')
.get(UserController.getSignupForm )
.post(UserController.createSignup )


router.route('/login')
.get(UserController.getLoginForm )
.post(saveUrl, passport.authenticate("local",{failureRedirect : "/login", failureFlash: true,}),UserController.createLogin )


router.get('/logout',UserController.logout )

module.exports = router;