// IMPORTACIONES
const express = require('express');
const cors = require('cors');
var app = express();

// IMPORTACIONES RUTAS
const CursosRutas = require('./src/routes/cursos.routes');
const AlumnoRutas = require('./src/routes/alumno.routes');
//const EncuestaRutas =require('./src/routes/encuesta.routes');

// MIDDLEWARES -> INTERMEDIARIOS
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// CABECERAS
app.use(cors());

// CARGA DE RUTAS localhost:3000/api/obtenerCursos
app.use('/api', CursosRutas, AlumnoRutas);


module.exports = app;