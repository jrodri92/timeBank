const express = require('express');
const router = express.Router();

const pool = require('../database')
const { isLoggedin } = require('../lib/auth');

router.get('/misofertas/add', async (req, res) => {
  const categorias = await pool.query('SELECT * FROM categorias');
  res.render('ofertas/add', { categorias: categorias });
});

router.post('/misofertas/add', isLoggedin, async (req, res) => {
  const { nombre_oferta, oferta_descripcion, categoria } = req.body;
  const newOferta = {
    nombre_oferta,
    oferta_descripcion,
    id_usuario: req.user.id_usuario
  };
  const oferta = await pool.query('INSERT INTO ofertas set ?', [newOferta]);
  const newOferta_Categoria = {
    id_oferta: oferta.insertId,
    id_categoria: categoria
  }

  await pool.query('INSERT INTO oferta_categoria set ?', [newOferta_Categoria]);

  req.flash('success', 'oferta saved successfully');
  res.redirect('/ofertas/misofertas');
});

router.get('/', isLoggedin, async (req, res) => {
  const ofertas = await pool.query('SELECT * FROM ofertas WHERE id_usuario <> ?', [req.user.id_usuario]);
  res.render('ofertas/listOfertas', { ofertas });
});

router.get('/misofertas', isLoggedin, async (req, res) => {
  const ofertas = await pool.query('SELECT * FROM ofertas WHERE id_usuario = ?', [req.user.id_usuario]);
  res.render('ofertas/listMisOfertas', { ofertas });
});


router.get('/misofertas/delete/:id', isLoggedin, async (req, res) => {
  const { id } = req.params;
  await pool.query('DELETE FROM ofertas WHERE id_oferta = ?', [id]);
  req.flash('success', 'Links Removed successfully');
  res.redirect('/ofertas/misofertas');
});

router.get('/misofertas/edit/:id', isLoggedin, async (req, res) => {
  const { id } = req.params;
  const ofertas = await pool.query('SELECT * FROM ofertas WHERE id_oferta = ?', [id]);
  res.render('ofertas/edit', { oferta: ofertas[0] });
});


router.post('/misofertas/edit/:id', isLoggedin, async (req, res) => {
  const { id } = req.params;
  const { nombre_oferta, descripcion } = req.body;
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
  res.render('ofertas/perfilOfertante', { perfil: perfil[0], oferta: oferta[0] });
});

router.post('/perfilofertante/:id/:idO', isLoggedin, async (req, res) => {
  const { id, idO } = req.params;
  const { tiempoOferta, solicitud_descripcion } = req.body;

  const newSolicitud = {
    "id_oferta": idO,
    "id_usuario": req.user.id_usuario,
    tiempoOferta,
    solicitud_descripcion
  };

  const tiempo = await pool.query('Select valorTiempo from tiempo where id_usuario = ?', [req.user.id_usuario]);
  if (tiempoOferta <= tiempo[0].valorTiempo) {
    nuevoTiempo = tiempo[0].valorTiempo - tiempoOferta;
    await pool.query('UPDATE tiempo set valortiempo = ? WHERE id_usuario = ?', [nuevoTiempo, req.user.id_usuario]);

    await pool.query('INSERT INTO solicitudes set ?', [newSolicitud]);
    req.flash('success', 'solicitud guardada exitosamenteee');
    res.redirect('/solicitudes/solicitadas');
  } else {
    req.flash('success', 'No tienes el tiempo suficiente');
    res.redirect('/solicitudes/solicitadas');
  }
});



module.exports = router;