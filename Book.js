const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    author: String,
    publicationYear: Number,
    genre: [String],
    eliminate: { type: Boolean, default: false }
});


module.exports = mongoose.model('Book', bookSchema);