const express = require("express");
const router = express.Router();
const CartManager = require("../dao/db/cart-manager-db.js");
const cartManager = new CartManager();

router.post("/carts", async (req, res) => {
    try {
        const newC = await cartManager.createCart();
        res.json({status: "success", newC});
    } catch (error) {
        console.error("ERROR: No se pudo crear un nuevo carrito");
        res.json({status: "error"});
    }
});

router.get("/carts/:cid", async (req, res) => {
    const cartId = req.params.cid;
    try {
        const cart = await cartManager.getCartById(cartId);
        res.json(cart.products);
    } catch (error) {
        console.error("ERROR: No se pudo obtener el carrito");
        res.json({status: "error"});
    }
});

router.post("/carts/:cid/product/:pid", async (req, res) => {
    const cartId = req.params.cid;
    const productId = req.params.pid;
    const quantity = req.body.quantity || 1;

    try {
        const updateCart = await cartManager.addProductToCart(cartId, productId, quantity);
        res.json(updateCart.products);
    } catch (error) {
        console.log("ERROR: Error al actualizador el carrito", error);
        res.status(500).json({error: "ERROR: Error del servidor al intentar actualizar el carrito"})
    }
});

module.exports = router;