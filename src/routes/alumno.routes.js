const express = require('express');
const alumnoControlador = require('../controllers/alumno.controller');
const md_autenticacion = require('../middlewares/autenticacion');

const api = express.Router();

api.post('/iniciarUsiarioPorDefecto', alumnoControlador.UsuarioPorDefecto);
api.post('/registrar', alumnoControlador.Registrar);
api.post('/login', alumnoControlador.Login);
api.put('/editarAlumno/:idAlumno', md_autenticacion.Auth, alumnoControlador.EditarAlumno);

module.exports = api;