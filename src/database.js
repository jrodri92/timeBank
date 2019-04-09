const mysql = require('mysql');
const { promisify } = require('util');

const { database } = require('./keys');
console.log(database)

const pool = mysql.createPool(database);

pool.getConnection((err,connection) =>{
    if(err){
        if(err.code === 'PROTOCOL_CONNECTION_LOST'){
            console.error('DATABASE_CONNECTION WAS CLOSED')
        }
        if (err.code === 'ER_CON_COUNT_ERROR'){
            Console.error('DATABASE HAS TO MANY CONNECTIONS')
        }
        if(err.code === 'ECONNREFUSED'){
            console.log('DATBASE CONNECTION WAS REFUSED')
        }
    }

    if(connection) connection.release();
    console.log('DB is Connected');
    return;
});

//promisify pool Querys
pool.query = promisify(pool.query);

module.exports = pool;