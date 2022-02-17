// IMPORTACIONES
const express = require('express');
const cursosController = require('../controllers/cursos.controller');
const md_autenticacion = require('../middlewares/autenticacion');

// RUTAS
var api = express.Router();
// PRODUCTOS
api.get('/cursos', cursosController.ObtenerCursos);
api.get('/cursos/:idCursos', cursosController.ObtenerCursoId);
api.post('/agregarCursos', cursosController.AgregarCurso);
api.put('/editarCursos/:idCurso', cursosController.EditarCurso);
api.delete('/eliminarCurso/:idCurso', cursosController.EliminarCurso);

module.exports = api;