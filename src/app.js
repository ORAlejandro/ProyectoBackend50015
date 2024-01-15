const express = require("express");
const app = express();
const exphbs = require("express-handlebars");
const PUERTO = 8080;

const productsRouter = require("./routes/products.router");
const cartsRouter = require("./routes/carts.router.js");
const viewsRouter = require("./routes/views.router.js");

//Middlewares
app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.use(express.static("./src/public"));

//CFG Handlebars
app.engine("handlebars", exphbs.engine());
app.set("view engine", "handlebars");
app.set("views", "./src/views");

//Routes
app.use("/api", productsRouter);
app.use("/api", cartsRouter);
app.use("/", viewsRouter);

//Listen
app.listen(PUERTO, () => {
    console.log(`Escuchando en http://localhost:${PUERTO}`);
});