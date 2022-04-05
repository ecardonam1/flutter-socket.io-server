const {io} = require("../index");

const Bands =require('../models/bands_model');
const Band = require('../models/band_model');

const bands = new Bands();

bands.addBand(new Band('Queen'));
bands.addBand(new Band('Mago de Oz'));
bands.addBand(new Band('Bon Jovi'));
bands.addBand(new Band('Heroes del Silencio'));
bands.addBand(new Band('Angeles del infierno'));




//Mensajes de Sockets
io.on('connection', client => {
    console.log('Cliente conectado');
    client.emit('active-bands',bands.getBands());

    client.on('disconnect', () => { console.log('Cliente desconectado'); });

    client.on('mensaje',(payload)=>{
        console.log('Mensaje!!!',payload);
        
        io.emit('mensaje',{admin: 'Nuevo mensaje'});
    });

    client.on('emitir-mensaje',(payload)=>{
        // console.log(payload);
        // io.emit('nuevo-mensaje',payload); //emite a todos!
        client.broadcast.emit('nuevo-mensaje',payload);  //emite a todos menos el que lo emitio
    })
    
    client.on('vote-band',(payload)=>{
        bands.voteBand(payload.id);
        io.emit('active-bands',bands.getBands());
    });

    client.on('add-band',(payload)=>{
        const newBand = new Band(payload.name);
        bands.addBand(newBand);
        io.emit('active-bands',bands.getBands());
    });

    client.on('delete-band',(payload)=>{
          bands.deleteBand(payload.id);
          io.emit('active-bands',bands.getBands());
    });
  });