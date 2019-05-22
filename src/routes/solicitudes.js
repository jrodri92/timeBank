const express = require('express');
const router = express.Router();
const pool = require('../database')
const { isLoggedin } = require('../lib/auth');


router.get('/solicitadas', isLoggedin, async (req, res) => {
  const solicitudes = await pool.query('Select id_solicitud, nombres, apellidos, nombre_oferta, tiempoOferta, estadoSolicitud, estadoDos from solicitudes s inner join ofertas o on s.id_oferta = o.id_oferta inner join usuarios u on o.id_usuario = u.id_usuario where s.id_usuario = ?', [req.user.id_usuario]);
  res.render('solicitudes/solicitadas', { solicitudes });
});

router.get('/ofrecidas', isLoggedin, async (req, res) => {
  const solicitudes = await pool.query('Select s.id_usuario, id_solicitud, nombres, apellidos, nombre_oferta, tiempoOferta, estadoSolicitud from solicitudes s inner join usuarios u on s.id_usuario = u.id_usuario inner join ofertas o on s.id_oferta = o.id_oferta where o.id_usuario = ?', [req.user.id_usuario]);
  res.render('solicitudes/ofrecidas', { solicitudes });
});

router.post('/confirmar/:id', isLoggedin, async (req, res) => {
  const { id } = req.params;
  await pool.query('UPDATE solicitudes set estadoSolicitud = 1 WHERE id_solicitud = ?', [id]);
  req.flash('success', 'Confirmado');
  res.redirect('/solicitudes/solicitud/'+id);
});

router.post('/pagar/:id', isLoggedin, async (req, res) => {
  const { id } = req.params;
  const estadoSolicitud = await pool.query('SELECT estadoSolicitud from solicitudes where id_solicitud = ?', [id]);
  if(estadoSolicitud[0].estadoSolicitud == 2){
    //Busca el usurio dueño de la oferta, al que se le va a pagar
    const usuario = await pool.query('SELECT o.id_usuario From solicitudes s inner join ofertas o on s.id_oferta = o.id_oferta where s.id_solicitud = ?', [id]);
    // obtiene el tiempo del usuario
    const tiempo = await pool.query('SELECT valorTiempo from tiempo where id_usuario = ?', [usuario[0].id_usuario]);
    // obtiene el tiempo de la solicitud
    const tiempoSolicitud = await pool.query('SELECT tiempoOferta from solicitudes where id_solicitud = ?', [id]);
    // suma el tiempo del usuario con el tiempo de la solicitud
    const nuevoTiempo = tiempo[0].valorTiempo + tiempoSolicitud[0].tiempoOferta;
    // actualiza el tiempo del ofertante
    await pool.query('UPDATE tiempo set valorTiempo = ? WHERE id_usuario = ?', [nuevoTiempo, usuario[0].id_usuario]);
    // Borra la solicitud

    const datos = await pool.query('select nombre_oferta, o.id_usuario as "id_ofertante", s.id_usuario as "id_solicitante", tiempoOferta as "tiempoSolicitado", nombres, apellidos from solicitudes s inner join ofertas o on s.id_oferta = o.id_oferta inner join usuarios u on s.id_usuario = u.id_usuario where id_solicitud = ?', [id]);
    await pool.query('INSERT INTO transacciones (nombreOferta, id_ofertante , id_solicitante, tiempoSolicitado, tiempoAnterior, tiempoNuevo, nombres, apellidos) VALUES (?, ?, ?, ?, ?, ?, ?, ?)', [datos[0].nombre_oferta, datos[0].id_ofertante, datos[0].id_solicitante, datos[0].tiempoSolicitado, tiempo[0].valorTiempo, nuevoTiempo, datos[0].nombres, datos[0].apellidos]);
    
    await pool.query('DELETE FROM solicitudes WHERE id_solicitud = ?', [id]);
    req.flash('success', 'Transacción Exito!, tu tiempo sera depositado');
    res.redirect('/solicitudes/solicitadas/');
  }

  if(estadoSolicitud[0].estadoSolicitud == 1){
    await pool.query('UPDATE solicitudes set estadoDos = 1 WHERE id_solicitud = ?', [id]);
    req.flash('success', 'Pagado con exito');
    res.redirect('/solicitudes/solicitadas');
  }
});


router.post('/terminar/:id', isLoggedin, async (req, res) => {
  const { id } = req.params;
  estadoPago = await pool.query('SELECT estadoDos from solicitudes where id_solicitud = ?', [id]);
  
  if(estadoPago[0].estadoDos == 0){
    await pool.query('UPDATE solicitudes set estadoSolicitud = 2 WHERE id_solicitud = ?', [id]);
    req.flash('success', 'Has terminado con exito');
    res.redirect('/solicitudes/solicitud/'+id);
  }

  if(estadoPago[0].estadoDos == 1){
    tiempo = await pool.query('SELECT valorTiempo from tiempo where id_usuario = ?', [req.user.id_usuario]);
    tiempoSolicitud = await pool.query('SELECT tiempoOferta from solicitudes where id_solicitud = ?', [id]);
    nuevoTiempo = tiempo[0].valorTiempo + tiempoSolicitud[0].tiempoOferta;
    await pool.query('UPDATE tiempo set valorTiempo = ? WHERE id_usuario = ?', [nuevoTiempo, req.user.id_usuario]);
    
    const datos = await pool.query('select nombre_oferta, o.id_usuario as "id_ofertante", s.id_usuario as "id_solicitante", tiempoOferta as "tiempoSolicitado", nombres, apellidos from solicitudes s inner join ofertas o on s.id_oferta = o.id_oferta inner join usuarios u on s.id_usuario = u.id_usuario where id_solicitud = ?', [id]);
    await pool.query('INSERT INTO transacciones (nombreOferta, id_ofertante , id_solicitante, tiempoSolicitado, tiempoAnterior, tiempoNuevo, nombres, apellidos) VALUES (?, ?, ?, ?, ?, ?, ?, ?)', [datos[0].nombre_oferta, datos[0].id_ofertante, datos[0].id_solicitante, datos[0].tiempoSolicitado, tiempo[0].valorTiempo, nuevoTiempo, datos[0].nombres, datos[0].apellidos]);
    
    await pool.query('DELETE FROM solicitudes WHERE id_solicitud = ?', [id]);
    
    req.flash('success', 'Has terminado con exito, tu tiempo sera debitado');
    res.redirect('/solicitudes/ofrecidas/');
  }  

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
    nuevoTiempo = tiempo[0].valorTiempo - tiempoOferta;  
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
  const solicitudes = await pool.query('Select s.id_usuario, id_solicitud, fechaSolicitud, email, celular, nombres, apellidos, nombre_oferta, tiempoOferta, estadoSolicitud, solicitud_descripcion from solicitudes s inner join usuarios u on s.id_usuario = u.id_usuario inner join ofertas o on s.id_oferta = o.id_oferta where id_solicitud = ?', [id]);
  res.render('solicitudes/solicitud', solicitudes[0]);
});

router.post('/cancelar/:id', isLoggedin, async (req, res) => {
  const { id } = req.params;
  tiempoOferta = await pool.query('Select tiempoOferta from solicitudes where id_solicitud = ?', [id]);
  tiempoTiempo = await pool.query('Select valorTiempo from tiempo where id_usuario = ?', [req.user.id_usuario]);
  const tiempo = tiempoOferta[0].tiempoOferta + tiempoTiempo[0].valorTiempo;
  await pool.query('UPDATE tiempo set valorTiempo = ? WHERE id_usuario = ?', [tiempo, req.user.id_usuario]);
  await pool.query('DELETE FROM solicitudes WHERE id_solicitud = ? and id_usuario = ?;', [id , req.user.id_usuario]);
  req.flash('success', 'Confirmado');
  res.redirect('/solicitudes/solicitadas');
});

router.get('/solicituduser/:id', isLoggedin, async (req, res) => {
  const { id } = req.params
  const estadoSolicitud = await pool.query('Select estadoSolicitud from solicitudes where id_solicitud = ?', [id]);
  
  if(estadoSolicitud[0].estadoSolicitud == 1){
    //muestra los datos completos
    const solicitudes = await pool.query('select id_solicitud, estadoDos, estadoSolicitud, nombres, apellidos, email, celular, nombre_oferta, tiempoOferta, fechaSolicitud, solicitud_descripcion from solicitudes s inner join ofertas o on s.id_oferta = o.id_oferta inner join usuarios u on o.id_usuario = u.id_usuario where id_solicitud = ?', [id]);
    res.render('solicitudes/solicituduser', solicitudes[0]);

  }
  if(estadoSolicitud[0].estadoSolicitud == 0){
    //solo  muestra algunos datos
    const solicitudes = await pool.query('select id_solicitud, estadoDos, estadoSolicitud, nombres, apellidos, tiempoOferta, nombre_oferta, fechaSolicitud, solicitud_descripcion from solicitudes s inner join ofertas o on s.id_oferta = o.id_oferta inner join usuarios u on o.id_usuario = u.id_usuario where id_solicitud = ?', [id]);
    res.render('solicitudes/solicituduser', solicitudes[0]);

  }
  
  //const solicitudes = await pool.query('Select s.id_usuario, id_solicitud, fechaSolicitud, email, celular, nombres, apellidos, nombre_oferta, tiempoOferta, estadoSolicitud, solicitud_descripcion from solicitudes s inner join usuarios u on s.id_usuario = u.id_usuario inner join ofertas o on s.id_oferta = o.id_oferta where id_solicitud = ?', [id]);
  res.render('solicitudes/solicitud', solicitudes[0]);
});

router.get('/transacciones', isLoggedin, async (req, res) => {
  const transacciones = await pool.query('Select * from transacciones where id_ofertante = ?', [req.user.id_usuario]);
  res.render('solicitudes/transacciones', { transacciones });
});

module.exports = router;


