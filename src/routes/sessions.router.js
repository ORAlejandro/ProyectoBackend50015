const express = require("express");
const router = express.Router();
const UserModel = require("../dao/models/user.model.js");
const { isValidPassword } = require("../utils/hashBcrypt.js");
const passport = require("passport");

/*
router.post("/login", async (req, res) => {
    const { email, password } = req.body;
    const admin = {
        first_name: "Coder",
        last_name: "House",
        age: 1,
        email: "adminCoder@coder.com",
        password: "adminCod3r123",
        rol: "admin"
    };
    try {
        const user = await UserModel.findOne({ email: email });
        if(email == admin.email && password == admin.password) {
            req.session.login = true;
            req.session.user = { ...admin };
            req.session.admin = true;
            res.redirect("/products");
            return
        };
        if (user) {
            //if (user.password == password) {
            if(isValidPassword(password, user)){
                req.session.login = true;
                req.session.user = {
                    email: user.email,
                    age: user.age,
                    first_name: user.first_name,
                    last_name: user.last_name,
                    rol: user.rol
                };
                res.redirect("/products");
            } else {
                res.status(401).send({
                    status: "error",
                    message: "contrasena no valida"
                });
            }
        } else {
            res.status(404).send({
                status: "error",
                message: "usuario no encontrado"
            });
        }
    } catch (error) {
        res.status(400).send({
            status: "error",
            message: "error en el login"
        });
    }
})
*/

router.post("/login", passport.authenticate("login", {failureRedirect: "/api/sessions/faillogin"}), async (req, res) => {
    if(!req.user) return res.status(400).send({
        status: "error",
        message: "credenciales invalidas"
    });
    req.session.user = {
        first_name: req.user.first_name,
        last_name: req.user.last_name,
        age: req.user.age,
        email: req.user.email,
        rol: req.user.rol
    }
    req.session.login = true;
    res.redirect("/profile");
})

router.get("/faillogin", async (req, res) => {
    console.log("Fallo la estrategia");
    res.send({
        status: "error",
        message: "error, fail login"
    });
})

router.get("/logout", (req, res) => {
    if (req.session.login) {
        req.session.destroy();
    }
    res.redirect("/login");
})

module.exports = router;