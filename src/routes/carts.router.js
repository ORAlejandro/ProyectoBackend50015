const express = require("express");
const router = express.Router();
const CartController = require("../dao/db/cart.controller.js");
const cartController = new CartController();
const authMiddleware = require("../middleware/auth.middleware.js");

router.use(authMiddleware);
router.post("/", cartController.newCart);
router.get("/:cid", cartController.getProductsFromCart);
router.post("/:cid/product/:pid", cartController.addProductToCart);
router.delete("/:cid/product/:pid", cartController.deleteProductFromCart);
router.put("/:cid", cartController.updateProductsFromCart);
router.put("/:cid/product/:pid", cartController.updateQuantity);
router.delete("/:cid", cartController.clearCart);
router.post("/:cid/purchase", cartController.finalizePurchase);

module.exports = router;