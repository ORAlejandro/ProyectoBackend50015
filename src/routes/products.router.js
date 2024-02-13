const express = require("express");
const router = express.Router();

const ProductManager = require("../dao/db/product-manager-db.js");
const productManager = new ProductManager();

const ProductModel = require("../dao/models/product.model.js");

router.get("/products", async (req, res) => { 
    try {
        const page = req.query.page || 1;
        const limit = req.query.limit || 10;
        const sort = req.query.sort || null;
        const query = req.query.query;
        //const limit = req.query.limit;
        //const resProducts = await productManager.getProducts();
        const resProductPaginate = await ProductModel.paginate({}, {limit, page, sort, query});
        res.json(resProductPaginate);
        //if (limit) {
        //    res.json(resProducts.slice(0, limit));
        //} else {
        //    res.json(resProducts);
        //}
    } catch (error) {
        console.error("ERROR: No se pudo obtener el producto", error);
        res.status(500).json({error: "ERROR: Error interno del servidor"})
    }
})

router.get("/products/:pid", async (req, res) => {
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

router.post("/products", async (req, res) => {
    const newProductA = req.body;
    
    try {
        await productManager.addProduct(newProductA);
        res.status(201).json({message: "Producto agregado exitosamente"})
    } catch (error) {
        console.log("ERROR: Error al agregar el producto", error);
        res.status(500).json({error: "ERROR: Error al intentar crear el producto"})
    }
})

router.put("/products/:pid", async (req, res) => {
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

router.delete("/products/:pid", async (req, res) => {
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