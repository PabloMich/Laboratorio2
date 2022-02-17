const mongoose = require('mongoose');
var Schema = mongoose.Schema;

var CursosSchema = Schema({
    nombre: String
});

module.exports = mongoose.model('Cursos', CursosSchema)