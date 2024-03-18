const express = require("express");
const router = express.Router();
const UserModel = require("../dao/models/user.model.js");
const { isValidPassword } = require("../utils/hashBcrypt.js");
const passport = require("passport");

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

//GitHub 3ro:
router.get("/github", passport.authenticate("github", {scope: ["user:email"]}), async (req, res) => {})

router.get("/githubcallback", passport.authenticate("github", {failureRedirect: "/login"}), async (req, res) => {
    req.session.user = req.user;
    req.session.login = true;
    res.redirect("/profile");
})

router.get("/current", async (req, res) => {
    try {
        if(!req.user) return res.status(511).send({
            status: "error",
            message: "No hay ningun usuario conectado"
        });
        res.json(req.user)
    } catch (error) {
        res.status(500).send({
            status: "error",
            message: "Internal server error"
        });
    }
})

module.exports = router;