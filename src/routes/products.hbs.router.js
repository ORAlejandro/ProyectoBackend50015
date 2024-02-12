const express = require("express");
const ProductManager = require("../dao/db/product-manager-db.js");
const productManager = new ProductManager();
const ProductModel = require("../dao/models/product.model.js");
const router = express.Router();

router.get("/products", async (req, res) => {
    const page = req.query.page || 1;
    const limit = 5;

    try {
        const listProducts = await ProductModel.paginate({}, {limit, page})

        const finalListProducts = listProducts.docs.map(product => {
            const {_id, ...rest} = product.toObject();
            return rest;
        })
        console.log(finalListProducts);
        res.render("products", {
            products: finalListProducts,
            hasPrevPage: listProducts.hasPrevPage,
            hasNextPage: listProducts.hasNextPage,
            prevPage: listProducts.prevPage,
            nextPage: listProducts.nextPage,
            currentPage: listProducts.page,
            totalPages: listProducts.totalPages
        });
    } catch (error) {
        res.status(500).send({Error: "Error del server"});
    }
    
})

module.exports = router;