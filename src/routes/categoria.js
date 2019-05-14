const express = require('express');
const router = express.Router();

const {isLoggedin} = require('../lib/auth');

router.get('/',isLoggedin,async (req,res)=> {
    res.render('categoria/categorias');
});

module.exports = router;