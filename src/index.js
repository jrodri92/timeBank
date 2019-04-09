const express = require('express');
const morgan = require('morgan');

//initialization
const app = express();

//settings
app.set('port', process.env.PORT || 4000);

//Middlewares
app.use(morgan('dev'));

//Global variable

//Routes
app.use(require('./routes/index.js'))
//public

// starting the server
app.listen(app.get('port'), () => {
    console.log('Serve on port', app.get('port'));
});