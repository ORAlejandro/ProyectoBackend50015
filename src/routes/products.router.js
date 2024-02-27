const express = require("express");
const router = express.Router();
const ProductManager = require("../dao/db/product-manager-db.js");
const productManager = new ProductManager();

router.get("/", async (req, res) => {
    try {
        
        if(!req.session.login) {
            return res.redirect("/login");
        }

        const { limit = 10, page = 1, sort, query } = req.query;

        const products = await productManager.getProducts({
            limit: parseInt(limit),
            page: parseInt(page),
            sort,
            query,
        });

        res.json({
            status: 'success',
            payload: products,
            totalPages: products.totalPages,
            prevPage: products.prevPage,
            nextPage: products.nextPage,
            page: products.page,
            hasPrevPage: products.hasPrevPage,
            hasNextPage: products.hasNextPage,
            prevLink: products.hasPrevPage ? `/api/products?limit=${limit}&page=${products.prevPage}&sort=${sort}&query=${query}` : null,
            nextLink: products.hasNextPage ? `/api/products?limit=${limit}&page=${products.nextPage}&sort=${sort}&query=${query}` : null,
        });

    } catch (error) {
        console.error("ERROR: Error al obtener productos", error);
        res.status(500).json(
            {status: 'error', error: "Error interno del servidor"}
        );
    }
});

router.get("/:pid", async (req, res) => {
    const id = req.params.pid;

    try {
        const product = await productManager.getProductById(id);

        if(!product) {
            return res.json({error: "ERROR: Producto no encontrado"})
        }
        
        res.json(product);
    } catch (error) {
        console.log("ERROR: No se pudo obtener el producto por id", error);
        res.status(500).json({error: "ERROR: El servidor no pudo encontrar el producto"})
    }
})

router.post("/", async (req, res) => {
    const newProductA = req.body;
    
    try {
        await productManager.addProduct(newProductA);

        res.status(201).json({message: "Producto agregado exitosamente"})

    } catch (error) {

        console.log("ERROR: Error al agregar el producto", error);

        res.status(500).json({error: "ERROR: Error al intentar crear el producto"})
    }
})

router.put("/:pid", async (req, res) => {
    const id = req.params.pid;
    const updatedProduct = req.body;

    try {
        await productManager.updateProduct(id, updatedProduct);

        res.json({message: "Producto actualizado exitosamente"})

    } catch (error) {

        console.error("ERROR: No se pudo actualizar el producto", error);

        res.status(500).json({error: "ERROR: Error del servidor al actualizar producto"})
    }
})

router.delete("/:pid", async (req, res) => {
    const id = req.params.pid;

    try {
        await productManager.deleteProduct(id);

        res.json({message: "Producto eliminado exitosamente"})

    } catch (error) {

        console.error("ERROR: No se pudo eliminar el producto")
        
        res.status(500).json({error: "ERROR: Error del servidor al intentar eliminar un producto"})
    }
})

module.exports = router;