const express = require('express');
const router = express.Router();
const pool = require('../database')
const { isLoggedin } = require('../lib/auth');

router.get('/solicitadas', isLoggedin, async (req, res) => {
  //const solicitadas = await pool.query('SELECT * FROM solicitudes WHERE id_usuario = ?',[req.user.id_usuario]);
  const solicitudes = await pool.query('Select s.id_usuario, id_solicitud, nombres, apellidos, nombre_oferta, tiempoOferta, estadoSolicitud from solicitudes s inner join usuarios u on s.id_usuario = u.id_usuario inner join ofertas o on s.id_oferta = o.id_oferta where o.id_usuario = ?', [req.user.id_usuario]);
  console.log(solicitudes);
  res.render('solicitudes/solicitadas', { solicitudes });
});

router.get('/ofrecidas', isLoggedin, async (req, res) => {
  //const solicitadas = await pool.query('SELECT * FROM solicitudes WHERE id_usuario = ?',[req.user.id_usuario]);
  const solicitudes = await pool.query('Select nombres, apellidos, s.id_usuario, nombre_oferta, tiempoOferta, estadoSolicitud from solicitudes s inner join usuarios u on s.id_usuario = u.id_usuario inner join ofertas o on s.id_oferta = o.id_oferta where o.id_usuario = ?', [req.user.id_usuario]);
  console.log(solicitudes);
  res.render('solicitudes/ofrecidas', { solicitudes });
});

router.post('/confirmar/:id', isLoggedin, async (req, res) => {
  const { id } = req.params;
  await pool.query('UPDATE solicitudes set estadoSolicitud = 0 WHERE id_solicitud = ?', [id]);
  req.flash('success', 'Confirmado');
  res.redirect('/solicitudes/solicitadas');
});

router.post('/solicitar/:id/:idO', isLoggedin, async (req, res) => {
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
    await pool.query('INSERT INTO solicitudes set ?', [newSolicitud]);
    req.flash('success', 'solicitud guardada exitosamenteee');
    res.redirect('/solicitudes/solicitadas');
  } else {
    req.flash('success', 'No tienes el tiempo suficiente');
    res.redirect('/solicitudes/solicitadas');
  }
});


router.get('/solicitud/:id', isLoggedin, async (req, res) => {
  const { id } = req.params
  //const { idO } = req.params 
  const solicitudes = await pool.query('Select s.id_usuario, id_solicitud, fechaSolicitud, email, celular, nombres, apellidos, nombre_oferta, tiempoOferta, estadoSolicitud, solicitud_descripcion from solicitudes s inner join usuarios u on s.id_usuario = u.id_usuario inner join ofertas o on s.id_oferta = o.id_oferta where id_solicitud = ?', [id]);
  //const oferta = await pool.query('SELECT * FROM ofertas WHERE id_oferta = ?', [idO]);
  //res.render('ofertas/perfilOfertante', {perfil: perfil[0] , oferta:oferta[0]});

  res.render('solicitudes/solicitud', solicitudes[0]);
});


module.exports = router;


