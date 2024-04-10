const UserModel = require("../models/user.model.js");
const CartModel = require("../models/cart.model.js");
const jwt = require("jsonwebtoken");
const { createHash, isValidPassword } = require("../../utils/hashBcrypt.js");
const UserDTO = require("../../dto/user.dto.js");

class UserController {
    async register(req, res) {
        const { first_name, last_name, email, password, age } = req.body;
        try {
            const existingUser = await UserModel.findOne({ email });
            if (existingUser) {
                return res.status(406).send("Failed: El usuario ya existe");
            }
            const newCart = new CartModel();
            await newCart.save();
            const newUser = new UserModel({
                first_name,
                last_name,
                email,
                cart: newCart._id,
                password: createHash(password),
                age
            });
            await newUser.save();
            const token = jwt.sign({ user: newUser }, "coderhouse", {
                expiresIn: "1h"
            });
            res.cookie("coderCookieToken", token, {
                maxAge: 3600000,
                httpOnly: true
            });
            res.redirect("/api/users/profile");
        } catch (error) {
            console.error("Error desde el registro: ", error);
            res.status(500).send("Error al registrar (f/controller)");
        }
    }

    async login(req, res) {
        const { email, password } = req.body;
        try {
            const findedUser = await UserModel.findOne({ email });
            if (!findedUser) {
                return res.status(400).send("Failed: Usuario inexistente");
            }
            const isValid = isValidPassword(password, findedUser);
            if (!isValid) {
                return res.status(406).send("Failed: Password incorrecto");
            }
            const token = jwt.sign({ user: findedUser }, "coderhouse", {
                expiresIn: "1h"
            });
            res.cookie("coderCookieToken", token, {
                maxAge: 3600000,
                httpOnly: true
            });
            res.redirect("/api/users/profile");
        } catch (error) {
            console.error("Error desde el login: ", error);
            res.status(500).send("Error al loguear (f/controller)");
        }
    }

    async profile(req, res) {
        try {
            const userDto = new UserDTO(req.user.first_name, req.user.last_name, req.user.role);
            const isAdmin = req.user.role === "admin";
            res.render("profile", { user: userDto, isAdmin });
        } catch (error) {
            console.error("Error en el profile: ", error);
            res.status(500).send("Error en el profile (f/controller)");
        }
    }

    async logout(req, res) {
        try {
            res.clearCookie("coderCookieToken");
            res.redirect("/login");
        } catch (error) {
            console.error("Error en el logout: ", error);
            res.status(500).send("Error en el logout (f/controller)");
        }
    }

    async admin(req, res) {
        try {
            if(req.user.role !== "admin") {
                return res.status(401).send("Acceso denegado");
            }
            res.render("admin");
        } catch (error) {
            console.error("Error desde el admin: ", error);
            res.status(500).send("Error en el admin (f/controller)");
        }
    }
}

module.exports = UserController;