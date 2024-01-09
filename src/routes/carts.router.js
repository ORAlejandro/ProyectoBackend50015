const express = require("express");
const router = express.Router();
const CartManager = require("../controller/cart-manager.js");
const cartManager = new CartManager("./src/models/carts.json");

router.post("/carts", async (req, res) => {
    try {
        const newC = await cartManager.createCart();
        res.json({status: "success", newC});
    } catch (error) {
        console.error("No se pudo crear un nuevo carrito");
        res.json({status: "error"});
    }
});

router.get("/carts/:cid", async (req, res) => {
    const cartId = parseInt(req.params.cid);
    try {
        const cart = await cartManager.getCartById(cartId);
        res.json(cart.products);
    } catch (error) {
        console.error("No se pudo obtener el carrito");
        res.json({status: "error"});
    }
});

router.post("/carts/:cid/product/:pid", async (req, res) => {
    const cartId = parseInt(req.params.cid);
    const productId = req.params.pid;
    const quantity = req.body.quantity || 1;

    try {
        const updateCart = await cartManager.addProductToCart(cartId, productId, quantity);
        res.json(updateCart.products);
    } catch (error) {
        console.error("Error al agregar producto al carrito");
        res.json({status: "error"});
    }
});

module.exports = router;