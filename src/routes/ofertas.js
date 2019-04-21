const express = require('express');
const router = express.Router();

const pool = require('../database')
const {isLoggedin} = require('../lib/auth');

router.get('/misofertas/add', (req, res)=>{
  res.render('ofertas/add');
});

router.post('/misofertas/add',isLoggedin, async (req,res) =>{
  const { nombre_oferta, oferta_descripcion } = req.body;
  const newLink = {
    nombre_oferta, 
    oferta_descripcion,
    id_usuario: req.user.id_usuario
  };
  console.log(newLink);
  await pool.query('INSERT INTO ofertas set ?', [newLink]);
  req.flash('success', 'oferta saved successfully');
  res.redirect('/ofertas/misofertas');
});


router.get('/', isLoggedin, async (req, res) => {
  const ofertas = await pool.query('SELECT * FROM ofertas WHERE id_usuario <> ?',[req.user.id_usuario]);
  res.render('ofertas/listOfertas', { ofertas });
});

router.get('/misofertas', isLoggedin, async (req, res) => {
    const ofertas = await pool.query('SELECT * FROM ofertas WHERE id_usuario = ?',[req.user.id_usuario]);
    res.render('ofertas/listMisOfertas', { ofertas });
  });


router.get('/misofertas/delete/:id',isLoggedin, async (req, res) => {
  const { id } = req.params;
  await pool.query('DELETE FROM ofertas WHERE id_oferta = ?', [id]);
  req.flash('success', 'Links Removed successfully');
  res.redirect('/ofertas/misofertas'); 
});

router.get('/misofertas/edit/:id',isLoggedin, async (req, res) => {
  const { id } = req.params;
  const ofertas = await pool.query('SELECT * FROM ofertas WHERE id_oferta = ?', [id]);
  res.render('ofertas/edit', {oferta: ofertas[0]});
});


router.post('/misofertas/edit/:id',isLoggedin, async(req, res) => {
  const { id } = req.params;
  const { nombre_oferta, descripcion } = req.body;
  console.log(req.body);
  const newLink = {
    nombre_oferta, 
    "oferta_descripcion": descripcion,
  };
  await pool.query('UPDATE ofertas set ? WHERE id_oferta = ?', [newLink, id]);
  req.flash('success', 'link updated successfully');
  res.redirect('/ofertas/misofertas');
});


router.get('/perfilofertante/:id/:idO', isLoggedin, async (req, res) => {
  const { id } = req.params
  const { idO } = req.params 
  const perfil = await pool.query('SELECT * FROM usuarios WHERE id_usuario =  ?', [id]);
  const oferta = await pool.query('SELECT * FROM ofertas WHERE id_oferta = ?', [idO]);
  res.render('ofertas/perfilOfertante', {perfil: perfil[0] , oferta:oferta[0]});
});

module.exports = router;