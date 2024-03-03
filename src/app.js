const express = require("express");
const app = express();
const exphbs = require("express-handlebars");
const socket = require("socket.io");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const PUERTO = 8080;
const passport = require("passport");
const initializePassport = require("./config/passport.config.js");
require("./database.js");

const productsRouter = require("./routes/products.router");
const cartsRouter = require("./routes/carts.router.js");
const viewsRouter = require("./routes/views.router.js");
const chatRouter = require("./routes/chat.router.js");
const userRouter = require("./routes/user.router.js");
const sessionRouter = require("./routes/sessions.router.js");

//Middlewares
app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.use(express.static("./src/public"));
app.use(cookieParser());
app.use(session({
    secret: "secretCoder",
    resave: true,
    saveUninitialized: true,
    store: MongoStore.create({
        mongoUrl: "mongodb+srv://aleortega:coderhouse@cluster0.oprbhbr.mongodb.net/ecommerce?retryWrites=true&w=majority"
    })
}))

initializePassport();
app.use(passport.initialize());
app.use(passport.session());

//CFG Handlebars
app.engine("handlebars", exphbs.engine());
app.set("view engine", "handlebars");
app.set("views", "./src/views");

//Routes
app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);
app.use("/", viewsRouter);
app.use("/", chatRouter);
app.use("/api/users", userRouter);
app.use("/api/sessions", sessionRouter);

//Listen
const httpServer = app.listen(PUERTO, () => {
    console.log(`Servidor escuchando en http://localhost:${PUERTO}`);
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