const express = require("express");
const router = express.Router();
const ViewsController = require("../dao/db/view.controller.js");
const viewsController = new ViewsController();
const passport = require("passport");
const checkUserRole = require("../middleware/checkrole.middleware.js");

router.get("/products", checkUserRole([ "usuario" ]), passport.authenticate("jwt", { session: false }), viewsController.renderProducts.bind(viewsController));
router.get("/carts/:cid", viewsController.renderCart);
router.get("/login", viewsController.renderLogin);
router.get("/register", viewsController.renderRegister);
router.get("/realtimeproducts", checkUserRole([ "admin" ]), viewsController.renderRealTimeProducts);
router.get("/chat", checkUserRole([ "usuario" ]), viewsController.renderChat);
router.get("/", viewsController.renderHome);

module.exports = router;