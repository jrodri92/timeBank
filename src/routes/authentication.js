const express = require('express');
const router = express.Router();

const passport = require('passport');
const {isLoggedin, isNotLoggedIn} = require('../lib/auth');

router.get('/signup', (req, res) => {
  res.render('auth/signup')
});

router.post('/signup', isNotLoggedIn, passport.authenticate('local.signup', {
  successRedirect: '/profile',
  failureRedirect: '/signup',
  failureFlash: true
}));

router.get('/signin', (req, res) =>{
  res.render('auth/signin');
});

router.post('/signin', isNotLoggedIn, (req, res, next) => {
  passport.authenticate('local.signin',{
    successRedirect: '/profile',
    failureRedirect: '/signin',
    failureFlash: true
  })(req,res,next);
});

router.get('/profile',isLoggedin, (req, res) => {
  res.render('profile');
});

router.get('/logout', isLoggedin, (req, res) => {
   req.logOut();
   res.redirect('/signin');
});

module.exports = router;