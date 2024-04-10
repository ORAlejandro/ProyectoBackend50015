const express = require("express");
const app = express();
const exphbs = require("express-handlebars");
const cookieParser = require("cookie-parser");
const configObject = require("./config/config.js");
const {PUERTO, mongo_url} = configObject;
const passport = require("passport");
const initializePassport = require("./config/passport.config.js");
const SocketManager = require("./sockets/socket.manager.js");
require("./database.js");

const productsRouter = require("./routes/products.router.js");
const cartsRouter = require("./routes/carts.router.js");
const viewsRouter = require("./routes/views.router.js");
const userRouter = require("./routes/user.router.js");

//Middlewares
app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.use(express.static("./src/public"));
app.use(cookieParser());
app.use(passport.initialize());
initializePassport();

//CFG Handlebars
app.engine("handlebars", exphbs.engine());
app.set("view engine", "handlebars");
app.set("views", "./src/views");

//Auth Middleware Propio:
const authMiddleware = require("./middleware/auth.middleware.js");
app.use(authMiddleware);

//Routes
app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);
app.use("/", viewsRouter);
app.use("/api/users", userRouter);

//Listen
const httpServer = app.listen(PUERTO, () => {
    console.log(`Servidor escuchando en http://localhost:${PUERTO}/home`);
});
new SocketManager(httpServer);