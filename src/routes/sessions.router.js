const express = require("express");
const router = express.Router();
const UserModel = require("../dao/models/user.model.js");

router.post("/login", async (req, res) => {

    const { email, password } = req.body;

    try {

        const usuario = await UserModel.findOne({ email: email });

        if (usuario) {

            if (usuario.password == password) {

                req.session.login = true;
                req.session.user = {
                    email: usuario.email,
                    age: usuario.age,
                    first_name: usuario.first_name,
                    last_name: usuario.last_name,
                };

                res.redirect("/profile");

            } else {
                res.status(401).send({ error: "Contraseña no valida" });
            }
        } else {
            res.status(404).send({ error: "Usuario no encontrado" });
        }

    } catch (error) {
        res.status(400).send({ error: "Error en el login" });
    }
})

router.get("/logout", (req, res) => {
    if (req.session.login) {
        req.session.destroy();
    }
    res.redirect("/login");
})

module.exports = router;