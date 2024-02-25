const express = require("express");
const router = express.Router();
const UserModel = require("../dao/models/user.model.js");

router.post("/", async (req, res) => {
    
    const { first_name, last_name, email, password, age } = req.body;

    try {
        await UserModel.create({
            first_name,
            last_name,
            email,
            password,
            age
        })

        res.status(200).send({
            status: "success",
            message: "Usuario creado con exito"
        })

    } catch (error) {
        res.status(400).send({
            status: "error",
            message: "Error al crear el usuario"
        })
    }
})

module.exports = router;