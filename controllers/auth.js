const {response} = require('express');
const { validationResult } = require('express-validator');
const { validarCampos } = require('../middlewares/validar-campos');
const usuario_model = require('../models/usuario_model');
const bcrypt = require('bcryptjs');
const { generarJWT } = require('../helpers/jwt');

const crearUsuario = async (req,res = response)=>{

    const {email,password} = req.body;
    try{

        const existeEmail =await usuario_model.findOne({email});
        if(existeEmail){
            return res.status(400).json({
                ok: false,
                msg: 'El correo ya existe'
            });
        }

        const usuario = new usuario_model(req.body);

        //Encriptar password
        const salt = bcrypt.genSaltSync();
        usuario.password = bcrypt.hashSync(password,salt);

        await usuario.save();

        // Generar mi JWT
        const token = await generarJWT(usuario.id);
    
       
       res.json({ok: true,usuario,token});

    }catch(error){
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador'
        });
    }


}

//const login .. req, res
// {ok: true, msg: 'login'}
const login = async (req,res = response)=>{

    try{
        const {email,password} = req.body;
        const usuarioDB = await usuario_model.findOne({email});
        if(!usuarioDB){
            return res.status(404).json({
                ok: false,
                msg: 'Email no encontrado'
            });
        }

        const validPassword = bcrypt.compareSync(password,usuarioDB.password);
        if(!validPassword){
            return res.status(400).json({
                ok: false,
                msg: 'El password no es valida'
            });
        }

        const token = await generarJWT(usuarioDB.id);

        res.json({ok: true,usuario: usuarioDB,token: token});
    }catch(error){
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Contactese con el administrador'
        });
    }

}

const renewToken = async(req,res = response)=> {

    const uid = req.uid;
    const token =await generarJWT(uid);
    const usuario =await usuario_model.findById(uid);


    res.json({
        ok: true,
        usuario: usuario,
        token: token
    });
}

module.exports = {
    crearUsuario,
    login,
    renewToken
}