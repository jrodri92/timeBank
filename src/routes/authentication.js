const express = require('express');
const router = express.Router();
const pool = require('../database')

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

router.get('/profile',isLoggedin, async(req, res) => {
  const user = res.req.user;
  const tiempo = await pool.query('SELECT valorTiempo FROM tiempo WHERE id_usuario = ?', [user.id_usuario]);
  res.render('profile',{tiempo: tiempo[0].valorTiempo, user});
});

router.get('/logout', isLoggedin, (req, res) => {
   req.logOut();
   res.redirect('/signin');
});

router.get('/modificar', isLoggedin, (req,res) => {
  res.render('auth/modificar',{ user: res.req.user});
});

router.post('/modificar', isLoggedin, async(req,res) => {
  const id = res.req.user.id_usuario;
  const { cedula, nombres,apellidos, email, 
    telefono,celular,
    user_description,frase } = req.body;

  const newUser = { 
    cedula, nombres,apellidos, email, 
    telefono,celular,
    user_description,frase 
  };
  console.log(id);
  console.log(newUser)
  await pool.query('UPDATE usuarios set ? WHERE id_usuario = ?', [newUser, id]);
  req.flash('success', 'link updated successfully');

  res.redirect('profile');
});

module.exports = router;