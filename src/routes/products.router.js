const express = require("express");
const router = express.Router();
const ProductManager = require("../controller/product-manager.js");
const productManager = new ProductManager("./src/models/products.json");

router.get("/products", async (req, res) => {
    try {
        const responseArray = await productManager.readFile();
        const limit = parseInt(req.query.limit);
        if (limit) {
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
        if (finded) {
            return res.send(finded)
        } else {
            return res.send("ID dont exist");
        }
    } catch (error) {
        console.error(error)
    }
})


router.post("/products", async (req, res) => {
    const { title, description, price, thumbnail, code, stock, status, category } = req.body;
    await productManager.addProduct({ title, description, price, thumbnail, code, stock, status, category });
    res.send({ status: "success", message: "Product created" });
})

router.put("/products/:pid", async (req, res) => {
    try {
        const productId = parseInt(req.params.pid);
        const modifiedProduct = req.body;
        await productManager.updateProduct(productId, modifiedProduct);
        res.json({status: "success", message: "Product correctly modified"});
    } catch (error) {
        res.json({status: "error", message: "You cant update product"})
    }
})

router.delete("/products/:pid", async (req, res) => {
    try {
        const productId = parseInt(req.params.pid);
        await productManager.deleteProduct(productId);
        res.json({status: "success", message: "Product deleted"})
    } catch (error) {
        res.json({status: "error", message: "You cant delete product"})
    }
})

module.exports = router;