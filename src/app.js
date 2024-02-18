const express = require("express");
const app = express();
const exphbs = require("express-handlebars");
const socket = require("socket.io");
const PUERTO = 8080;
require("./database.js");

const productsRouter = require("./routes/products.router");
const cartsRouter = require("./routes/carts.router.js");
const chatRouter = require("./routes/chat.router.js");
const productsHbsRouter = require("./routes/products.hbs.router.js");

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
//Routes renderizadas en hbs
app.use("/", chatRouter);
app.use("/", productsHbsRouter);

//Listen
const httpServer = app.listen(PUERTO, () => {
    console.log(`Servidor escuchando en el puerto ${PUERTO}`);
});

const io = new socket.Server(httpServer);

const MessageModel = require("./dao/models/message.model.js");

io.on("connection", (socket) => {
    console.log("Nuevo usuario conectado");

    socket.on("message", async data => {

        await MessageModel.create(data);

        const messages = await MessageModel.find();
        console.log(messages);
        io.sockets.emit("message", messages);
     
    })
});