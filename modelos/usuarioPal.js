const mongoose = require('mongoose');

const usuarioSchema = new mongoose.Schema({
     nombre: {
        type: String,
        required: true
    },

    correo: {
        type: String,
        required: true
    },

    mensaje: {
        type: String
    }
});

module.exports = mongoose.model('Usuario', usuarioSchema);
