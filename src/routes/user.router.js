const express = require("express");
const router = express.Router();
const UserModel = require("../dao/models/user.model.js");
const { createHash } = require("../utils/hashBcrypt.js");
const passport = require("passport");

/*
router.post("/", async (req, res) => {
    const { first_name, last_name, email, password, age, rol = "usuario" } = req.body;
    try {
        const existingUser = await UserModel.findOne({ email: email });
        if (existingUser) {
            return res.status(400).send({
                status: "error",
                message: "El correo electronico ya se encuentra registrado"
            });
        }
        const newUser = await UserModel.create({ first_name, last_name, email, password:createHash(password), age, rol });
        req.session.login = true;
        req.session.user = { ...newUser._doc };
        res.status(200).send({
            status: "success",
            message: "Usuario creado con exito"
        });
    } catch (error) {
        console.error("ERROR: No se pudo crear el usuario: ", error);
        res.status(500).send({
            status: "error",
            message: "Internal Server Error"
        });
    }
});
*/

router.post("/", passport.authenticate("register", {
    failureRedirect: "/failedregister"
}), async (req, res) => {
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

router.get("/failedregister", (req, res) => {
    res.send({
        error: "error",
        message: "error al registrar"
    })
})

module.exports = router;