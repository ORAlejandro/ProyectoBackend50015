const express = require("express");
const router = express.Router();
const ProductManager = require("../controller/product-manager.js");
const productManager = new ProductManager("./src/models/products.json");

router.get("/products", async (req, res) => {
    try {
        const responseArray = await productManager.readFile();
        const limit = parseInt(req.query.limit);
        if(limit) {
            const limitArray = responseArray.slice(0, limit)
            return res.send(limitArray);
        } else {
            return res.send(responseArray);
        }
    } catch (error) {
        console.error("ERROR");
        return res.send("Error");
    }
})

router.get("/products/:pid", async (req, res) => {
    try {
        let pid = parseInt(req.params.pid);
        const finded = await productManager.getProductById(pid);
        if(finded) {
            return res.send(finded)
        } else {
            return res.send("ID dont exist");
        }
    } catch (error) {
        console.error(error)
    }
})


router.post("/products", async (req, res) => {
    const {title, description, price, thumbnail, code, stock, status, category} = req.body;
    await productManager.addProduct({title, description, price, thumbnail, code, stock, status, category});
    res.send({status: "success", message: "Product created"});
})


/*
router.post("/products", async (req, res) => {
    try {
        const newProduct = req.body;
        const responseArray = await productManager.readFile();
        const responseNewProduct = await productManager.addProduct(newProduct);
        if(responseArray) {
            responseArray.push(responseNewProduct);
            res.send({status: "success", message: "Product created"})
        } else {
            console.log("Problem with the new product");
            res.status(500).send({status: "error", message: "Product error"});
        }
    } catch (error) {
        console.error("Error to create a new product");
        res.status(500).send({status: "error", message: "Server error 500"});
    }
})
*/

module.exports = router;