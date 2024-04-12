const express = require("express");
const router = express.Router();
const ProductController = require("../dao/db/product.controller.js");
const productController = new ProductController();

router.get("/", productController.getProducts);
router.get("/:pid", productController.getProductsById);
router.post("/", productController.addProduct);
router.put("/:pid", productController.updateProduct);
router.delete("/:pid", productController.deleteProduct);

module.exports = router;