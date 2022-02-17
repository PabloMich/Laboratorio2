const Alumno = require('../models/alumno.model');
const bcrypt = require('bcrypt-nodejs');
const jwt = require('../services/jwt');

function Registrar(req, res) {
    var parametros = req.body;
    var alumnoModel = new Alumno();

    if(parametros.nombre && parametros.apellido && 
        parametros.email && parametros.password) {
            alumnoModel.nombre = parametros.nombre;
            alumnoModel.apellido = parametros.apellido;
            alumnoModel.email = parametros.email;
            alumnoModel.rol = 'ALUMNO';

            Alumno.find({ email : parametros.email }, (err, alumnoEncontrado) => {
                if ( alumnoEncontrado.length == 0 ) {

                    bcrypt.hash(parametros.password, null, null, (err, passwordEncriptada) => {
                        alumnoModel.password = passwordEncriptada;

                        alumnoModel.save((err, alumnoGuardado) => {
                            if (err) return res.status(500)
                                .send({ mensaje: 'Error en la peticion' });
                            if(!alumnoGuardado) return res.status(500)
                                .send({ mensaje: 'Error al agregar el alumno'});
                            
                            return res.status(200).send({ alumno: alumnoGuardado });
                        });
                    });                    
                } else {
                    return res.status(500)
                        .send({ mensaje: 'Este correo, ya  se encuentra utilizado' });
                }
            })
    }
}

function Login(req, res) {
    var parametros = req.body;
    Alumno.findOne({ email : parametros.email }, (err, alumnoEncontrado)=>{
        if(err) return res.status(500).send({ mensaje: 'Error en la peticion' });
        if(alumnoEncontrado){
            // COMPARO CONTRASENA SIN ENCRIPTAR CON LA ENCRIPTADA
            bcrypt.compare(parametros.password, alumnoEncontrado.password, 
                (err, verificacionPassword)=>{//TRUE OR FALSE
                    // VERIFICO SI EL PASSWORD COINCIDE EN BASE DE DATOS
                    if ( verificacionPassword ) {
                        // SI EL PARAMETRO OBTENERTOKEN ES TRUE, CREA EL TOKEN
                        if(parametros.obtenerToken === 'true'){
                            return res.status(200)
                                .send({ token: jwt.crearToken(alumnoEncontrado) })
                        } else {
                            alumnoEncontrado.password = undefined;
                            return  res.status(200)
                                .send({ usuario: alumnoEncontrado })
                        }

                        
                    } else {
                        return res.status(500)
                            .send({ mensaje: 'Las contrasena no coincide'});
                    }
                })

        } else {
            return res.status(500)
                .send({ mensaje: 'Error, el correo no se encuentra registrado.'})
        }
    })
}

function UsuarioPorDefecto(req, res) {
    var usuarioModel = new Usuario();
    Usuario.find({ userName: 'MAESTRO' }, (err, usuarioEncontrado) => {
        if (err) return res.status(500).send({ mensaje: 'Error en la peticion' });
        if (usuarioEncontrado.length == 0) {
            usuarioModel.userName = 'MAESTRO'
            usuarioModel.rol = 'ROL_MAESTRO'
            usuarioModel.password = bcrypt.hash('123456', null, null, (err, passwordEncriptada) => {
                usuarioModel.password = passwordEncriptada;
                usuarioModel.save((err, usuarioGuardado) => {
                    if (err) return res.status(500)
                        .send({ mensaje: 'Error en la peticion' });
                    if (!usuarioGuardado) return res.status(500)
                        .send({ mensaje: 'Error al agregar el Usuario' });
    
                    return res.status(200).send({ usuario: usuarioGuardado });
                });
            });
        }else{
            return res.status(500).send({mensaje: "el usuario maestro ya existe"})
        }
    })
    
}

function EditarAlumno(req, res) {
    var idAlum = req.params.idAlumno;
    var parametros = req.body;    

    if ( idAlum !== req.user.sub ) return res.status(500)
        .send({ mensaje: 'No puede editar otros Alumnos'});

    Alumno.findByIdAndUpdate(req.user.sub, parametros, {new : true},
        (err, alumnoActualizado)=>{
            if(err) return res.status(500)
                .send({ mensaje: 'Error en la peticion' });
            if(!alumnoActualizado) return res.status(500)
                .send({ mensaje: 'Error al editar el alumno'});
            
            return res.status(200).send({alumno : alumnoActualizado})
        })
}

module.exports = {
    Registrar,
    Login,
    UsuarioPorDefecto,
    EditarAlumno
}