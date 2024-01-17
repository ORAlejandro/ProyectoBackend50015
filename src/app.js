const express = require("express");
const app = express();
const exphbs = require("express-handlebars");
const socket = require("socket.io");
const ProductManager = require("./controller/product-manager.js");
const productManager = new ProductManager("./src/models/products.json");
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
const server = app.listen(PUERTO, () => {
    console.log(`Servidor escuchando en el puerto ${PUERTO}`);
});

const io = socket(server);

io.on("connection", async (socket) => {
    console.log("Un cliente se ha conectado");

    socket.emit("productos", await productManager.getProducts());

    socket.on("eliminarProducto", async (id) => {
        await productManager.deleteProduct(id);
        io.sockets.emit("productos", await productManager.getProducts());
    });

    socket.on("agregarProducto", async (product) => {
        await productManager.addProduct(product);
        io.sockets.emit("productos", await productManager.getProducts());
    });
});