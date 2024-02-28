const express = require("express");
const router = express.Router();
const UserModel = require("../dao/models/user.model.js");

router.post("/", async (req, res) => {
    const { first_name, last_name, email, password, age, rol = "usuario" } = req.body;

    try {
        
        const existingUser = await UserModel.findOne({ email: email });
        if (existingUser) {
            return res.status(400).send({
                status: "error",
                message: "El correo electronica ya se encuentra registrado"
            });
        }

        const newUser = await UserModel.create({ first_name, last_name, email, password, age, rol });

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

module.exports = router;