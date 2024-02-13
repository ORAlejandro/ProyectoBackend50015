const express = require("express");
const router = express.Router();
const CartManager = require("../dao/db/cart-manager-db.js");
const cartManager = new CartManager;

router.get("/carts/:cid", async (req, res) => {
    try {
        const cartId = req.params.cid;
        const resCartId = await cartManager.getCartById(cartId);
        if(resCartId) {
            res.render("carts", {cart: resCartId})
        } else {
            res.json({Error: "Carrito inexistente"})
        }
    } catch (error) {
        console.error("ERROR: No se logro encontrar una carrito con el ID especificado");
        res.json({status: "ERROR: ID inexistente"});
    }
})

module.exports = router;
