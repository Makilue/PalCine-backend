const mongoose = require('mongoose');
const Book = require('./Book');

mongoose.connect("mongodb://127.0.0.1/curso_node", {
    //useNewUrlParser: true,
   // useUnifiedTopology: true
}).then(() => {
    console.log("Conexión exitosa a la base de datos");
}).catch(err => {
    console.error("Error al conectar a la base de datos:", err);
});

/*
run()
async function run() {
    const newBook = new Book({
        title: "",
        author: "William Golding",
        publicationYear: 1999,
        genre: ["Ficción", "Classic"],
    });
    await newBook.save()
    .then(savedBook => {
        console.log("Libro guardado:", newBook);
    })
    .catch(err => {
        console.error("Error al guardar el libro:", err);
    });
}
*/


/*
run()
async function run(){
    const allBook = await Book.find({ author: "Nuevo autor" });
    console.log("All books:", allBook);
}
*/
//---------------------------------------------- funcion update

/*
run()
async function run() {
   const bookId = "6ab730d49d00554a70fee6e6"; //ID del elemento a eliminar
    const updatedBook = await Book.findByIdAndUpdate(
        bookId,
        { title: "Patatas al rescate" , author: "e patate" }, //Cambia las cosas 
        { new: true }//documento actualizado
    );
    console.log(updatedBook);

    // const showRecord = await Book.find();
    // console.log(showRecord);

}
*/


//---------------------------------------------- funcion delete
/*
run()
async function run() {
   const bookId = "6ab725c05ad6a82cc02edbf8"; //ID del elemento a eliminar
    const deleteBook = await Book.findByIdAndDelete(
        bookId,
        { new: true }//documento actualizado
    );
    console.log(deleteBook);

    // const showRecord = await Book.find();
    // console.log(showRecord);

}
*/
//---------------------------------------------- find one and delete

/*
run()
async function run() {
   const updatedRecord = await Book.findOneAndUpdate (
        { title: "Patatas al rescate" }, //Criterio de busqueda por filtro
        { title: "Patatas al rescate 2" }, //Nuevo valor
        { new: true } //actualiza
    );
    console.log(updatedRecord);

    // const showRecord = await Book.find();
    // console.log(showRecord);

}
    */

/*
async function eliminarLibro(bookId) {
  const libroEliminado = await Book.findByIdAndUpdate(
    bookId,
    { eliminado: true }, 
    { new: true }
  );
  console.log("Libro marcado como eliminado:", libroEliminado);
} */