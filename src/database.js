//Instalo mooongose npm i mongoose y lo requiero
const mongoose = require("mongoose");

//Establecemos una conexion
mongoose.connect("mongodb+srv://aleortega:coderhouse@cluster0.oprbhbr.mongodb.net/ecommerce?retryWrites=true&w=majority")
    .then(() => console.log("Exito al conectar a MongoDB"))
    .catch(() => console.log("Error al conectar a MongoDB"))