const express = require("express");
const router = express.Router();
const passport = require("passport");
const UserController = require("../dao/db/user.controller.js");
const userController = new UserController();

router.post("/register", userController.register.bind(userController));
router.post("/login", userController.login.bind(userController));
router.get("/profile", passport.authenticate("jwt", { session: false }), userController.profile.bind(userController));
router.post("/logout", userController.logout.bind(userController));
router.get("/admin", passport.authenticate("jwt", { session: false }), userController.admin.bind(userController));
//Volver a implementar la logica para el logeo de github.

module.exports = router;