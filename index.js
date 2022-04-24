const express = require('express');
require('dotenv').config();

//DB config
const {dbConnection} = require('./database/config');
dbConnection();

//app de express
const app = express();

//Lectura y parselo del Body
app.use(express.json());


//NODE SERVER
const server = require('http').createServer(app);
module.exports.io = require('socket.io')(server);
require('./sockets/socket');



const path = require('path');



// Path publico
const publicPath = path.resolve( __dirname, 'public' );

//Mis rutas
app.use('/api/login',require('./routes/auth'));

app.use(express.static(publicPath));

server.listen(process.env.PORT,(err)=>{
    if(err) throw new Error(err);

    console.log('Servidor corriendo en puerto',process.env.PORT);

});