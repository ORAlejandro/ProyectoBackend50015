const express = require("express");
const router = express.Router();
const ProductManager = require("../dao/fs/product-manager.js");
const productManager = new ProductManager("./src/models/products.json");

router.get("/", async (req, res) => {
    try {
        const products = await productManager.getProducts();
        res.render("index", {
            products: products
        });
    } catch (error) {
        console.error("Error al intentar obtener los productos", error);
        res.status(500).json({error: "Error interno del servidor"});
    }
})

router.get("/realtimeproducts", async (req, res) => {
    try {
        res.render("realtimeproducts");
    } catch (error) {
        console.error("Error al intertar cargar los productos en tiempo real", error);
        res.status(500).json({error: "Error interno del servidor"});
    }
})

module.exports = router;