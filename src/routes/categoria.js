const express = require('express');
const router = express.Router();
const pool = require('../database')

const {isLoggedin} = require('../lib/auth');

router.get('/',isLoggedin,async (req,res)=> {
    const categorias = await pool.query('SELECT * FROM categorias');
    res.render('categoria/categorias',{categorias});
});

router.get('/:id',isLoggedin,async (req,res)=> {
    const { id } = req.params;
    const ofertas = await pool.query('SELECT o.*, c.nombre FROM categorias c INNER JOIN oferta_categoria AS of on c.id_categoria = of.id_categoria INNER JOIN ofertas AS o on o.id_oferta = of.id_oferta WHERE c.id_categoria = ?',[id]);
    const nombre = await pool.query('SELECT nombre FROM categorias WHERE id_categoria = ?',[id]);
    
    res.render('categoria/categoria_especifica',{ ofertas, nombre: nombre[0].nombre });
});

module.exports = router;