const express = require("express");
const router = express.Router();
const ProductManager = require("../controller/product-manager.js");
const productManager = new ProductManager("./src/models/carts.json");

router.get("/carts", async (req, res) => {
    try {
        const cart = await productManager.readFile();
        res.json(cart);
    } catch (error) {
        console.log("Error al obtener el cart", error);
        res.json({status: "Error del servidor"});
    }
})

module.exports = router;
