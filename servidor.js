const express = require('express');
const mongoose = require('mongoose');

const Usuario = require('./modelos/usuarioPal');

const app = express();


// ==========================================
// CONEXIÓN CON MONGODB
// ==========================================

mongoose.connect('mongodb://127.0.0.1:27017/BaseDatosPal')
    .then(() => {
        console.log('Conectado a MongoDB');
    })
    .catch((error) => {
        console.log('Error de conexión:', error);
    });


// ==========================================
// MIDDLEWARE
// ==========================================

app.use(express.urlencoded({ extended: true }));

app.use(express.json());

app.use(express.static('public'));


// ==========================================
// CREATE - CREAR USUARIO
// ==========================================

app.post('/usuarios', async (req, res) => {

    try {

        const nuevoUsuario = new Usuario({
            nombre: req.body.nombre,
            correo: req.body.correo,
            mensaje: req.body.mensaje
        });

        await nuevoUsuario.save();

        console.log('Usuario guardado:', nuevoUsuario);

        res.send('Usuario registrado correctamente');

    } catch (error) {

        console.log('Error al guardar usuario:', error);

        res.status(500).send('Error al registrar usuario');

    }

});


// ==========================================
// READ - CONSULTAR USUARIOS
// ==========================================

app.get('/usuarios', async (req, res) => {

    try {

        const usuarios = await Usuario.find();

        res.json(usuarios);

    } catch (error) {

        console.log('Error al obtener usuarios:', error);

        res.status(500).send('Error al obtener usuarios');

    }

});


// ==========================================
// UPDATE - ACTUALIZAR USUARIO
// ==========================================

app.put('/usuarios/:id', async (req, res) => {

    try {

        const usuarioActualizado = await Usuario.findByIdAndUpdate(
            req.params.id,
            {
                nombre: req.body.nombre,
                correo: req.body.correo,
                mensaje: req.body.mensaje
            },
            {
                new: true,
                runValidators: true
            }
        );

        if (!usuarioActualizado) {
            return res.status(404).send('Usuario no encontrado');
        }

        res.json(usuarioActualizado);

    } catch (error) {

        console.log('Error al actualizar:', error);

        res.status(500).send('Error al actualizar usuario');

    }

});


// ==========================================
// DELETE - ELIMINAR USUARIO
// ==========================================

app.delete('/usuarios/:id', async (req, res) => {

    try {

        const usuarioEliminado = await Usuario.findByIdAndDelete(
            req.params.id
        );

        if (!usuarioEliminado) {
            return res.status(404).send('Usuario no encontrado');
        }

        res.send('Usuario eliminado correctamente');

    } catch (error) {

        console.log('Error al eliminar:', error);

        res.status(500).send('Error al eliminar usuario');

    }

});


// ==========================================
// INICIAR SERVIDOR EXPRESS
// ==========================================

app.listen(3000, () => {

    console.log('Servidor ejecutándose en http://localhost:3000');

});