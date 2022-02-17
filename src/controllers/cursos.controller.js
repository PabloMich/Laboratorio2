const Cursos = require('../models/cursos.model');

// Obtener datos cursos de Mongo
function ObtenerCursos (req, res) {
    Cursos.find((err, cursosObtenidos) => {
        if (err) return res.send({ mensaje: "Error: " + err })

        for (let i = 0; i < cursosObtenidos.length; i++) {
            console.log(cursosObtenidos[i].nombre)
        }

        return res.send({ cursos: cursosObtenidos })
    })
}

// OBTENER CURSOS POR ID
function ObtenerCursoId(req, res) {
    var idCurs = req.params.idCursos;

    Cursos.findById(idCurs, (err, cursoEncontrado) => {
        if (err) return res.status(500).send({ mensaje: 'Error en la peticion' });
        if (!cursoEncontrado) return res.status(404).send( { mensaje: 'Error al obtener los datos' });

        return res.status(200).send({ curso: cursoEncontrado });
    })
}

// AGREGAR CURSO
function AgregarCurso (req, res){
    var parametros = req.body;
    var cursoModelo = new Cursos();

    if( parametros.nombre ) {
        cursoModelo.nombre = parametros.nombre;

        cursoModelo.save((err, cursoGuardado) => {
            if(err) return res.status(500).send({ mensaje: "Error en la peticion" });
            if(!cursoGuardado) return res.status(404).send( { mensaje: "Error, no se agrego ningun curso"});

            return res.status(200).send({ curso: cursoGuardado });
        })
    }
}

// EDITAR CURSO
function EditarCurso (req, res) {
    var idCurs = req.params.idCurso;
    var parametros = req.body;

    Cursos.findByIdAndUpdate(idCurs, parametros, { new: true } ,(err, cursoActualizado) => {
        if (err) return res.status(500).send({ mensaje: 'Error en la peticion'});
        if(!cursoActualizado) return res.status(404).send( { mensaje: 'Error al Editar el curso'});

        return res.status(200).send({ curso: cursoActualizado});
    });
}

// ELIMINAR CURSO
function EliminarCurso(req, res) {
    var idCurs = req.params.idCurso;

    Cursos.findByIdAndDelete(idCurs, (err, cursoEliminado) => {
        if(err) return res.status(500).send({ mensaje: 'Error en la peticion'});
        if(!cursoEliminado) return res.status(404).send( { mensaje: 'Error al eliminar el curso'});

        return res.status(200).send({ curso: cursoEliminado});
    })
}

module.exports = {
    ObtenerCursos,
    ObtenerCursoId,
    AgregarCurso,
    EditarCurso,
    EliminarCurso
}