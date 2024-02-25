const express = require("express");
const router = express.Router();
const UserModel = require("../dao/models/user.model.js");

router.post("/login", async (req, res) => {

    const { email, password } = req.body;

    try {
        const user = await UserModel.findOne({ email: email });
        if(user) {
            if(user.password == password) {
                req.session.login = true;
                res.status(200).send({
                    status: "success",
                    message: "logeado correctamente"
                });
            } else {
                res.status(403).send({
                    status: "error",
                    message: "Password invalida"
                });
            }
        } else {
            res.status(404).send({
                status: "error",
                message: "el usuario no existe"
            });
        }
    } catch (error) {
        res.status(400).send({
            status: "error",
            message: "error al intentar logear"
        });
    }
})

router.get("/logout", (req, res) => {
    if(req.session.login) {
        req.session.destroy();
    }
    res.status(200).send({
        status: "success",
        message: "Login eliminado"
    });
})

module.exports = router;