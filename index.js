const express = require('express');
require('dotenv').config();

//app de express
const app = express();


//NODE SERVER
const server = require('http').createServer(app);
module.exports.io = require('socket.io')(server);
require('./sockets/socket');



const path = require('path');



// Path publico
const publicPath = path.resolve( __dirname, 'public' );

app.use(express.static(publicPath));

server.listen(process.env.PORT,(err)=>{
    if(err) throw new Error(err);

    console.log('Servidor corriendo en puerto',process.env.PORT);

});