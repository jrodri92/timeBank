const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

const pool = require('../database');
const helpers = require('../lib/helpers');

passport.use('local.signin', new LocalStrategy({
    usernameField: 'username',
    passwordField: 'password',
    passReqToCallback: true
}, async (req, username, password,done) =>{
    const rows = await pool.query('SELECT * FROM usuarios WHERE username = ?',[username])
    if(rows.length > 0){
        const user = rows[0];
        const validPassword = await helpers.matchPassword(password, user.password)
        if(validPassword){
            done(null, user, req.flash('success', 'Welcome'+ user.username));
        } else{
            done(null, false, req.flash('message','Incorrect Password'))
        }
    }else{
        return done(null, false, req.flash('message', 'The Username does not exist'));  
    }
}));

passport.use('local.signup', new LocalStrategy({
    usernameField: 'username',
    passwordField: 'password',
    passReqToCallback: true
}, async (req, username, password, done) => {
    const { cedula, nombres,apellidos, email, 
        fechaNacimineto,telefono,celular,
        user_description,frase } = req.body;
    const newUser = {
        cedula,nombres,apellidos,
        username,password,email,
        fechaNacimineto,telefono,
        celular,user_description,frase
    };
    newUser.password = await helpers.encryptPassword(password);
    const result = await pool.query('INSERT INTO usuarios SET ?', [newUser]);
    const newTime = {
        id_usuario: result.insertId,
        ValorTiempo: 10
    };
    await pool.query('INSERT INTO tiempo SET ?', [newTime]);
    newUser.id_usuario = result.insertId;
    return done(null, newUser);

}));

passport.serializeUser((usuario, done) => {
    console.log("serial");
    console.log(usuario);
    done(null,usuario.id_usuario);
});

passport.deserializeUser(async (id_usuario, done) => {
    console.log("desserial");
    console.log(id_usuario);
    const rows = await pool.query('SELECT * FROM usuarios WHERE id_usuario = ?',[id_usuario]); 
    done(null, rows[0]);
});