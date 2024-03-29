const express = require("express");
const router = express.Router();
const ProductManager = require("../dao/db/product-manager-db.js");
const CartManager = require("../dao/db/cart-manager-db.js");
const productManager = new ProductManager();
const cartManager = new CartManager();

router.get("/", (req, res) => {
    res.redirect("/login");
});

router.get("/products", async (req, res) => {

    if(!req.session.login) {
        res.redirect("/login");
        return
    }

    try {
        const { page = 1, limit = 2 } = req.query;
        const products = await productManager.getProducts({
            page: parseInt(page),
            limit: parseInt(limit)
        });

        const newArray = products.docs.map(product => {
            const { _id, ...rest } = product.toObject();
            return rest;
        });

        res.render("products", {
            products: newArray,
            hasPrevPage: products.hasPrevPage,
            hasNextPage: products.hasNextPage,
            prevPage: products.prevPage,
            nextPage: products.nextPage,
            currentPage: products.page,
            totalPages: products.totalPages,
            user: req.session.user
        });
    } catch (error) {
        console.log("ERROR: No se pudo obtener el producto", error);
        res.status(500).json(
            {status: "error", error: "Internal Server Error"}
        );
    }
});

router.get("/carts/:cid", async (req, res) => {
    const cartId = req.params.cid;

    try {
        const cart = await cartManager.getCartById(cartId);
        
        if(!cart) {
            console.log("ERROR: No existe un carrito con ese id")
            return res.status(404).json(
                {status: "error", error: "No se pudo encontrar el carrito"}
            )
        }

        const productsOnCart = cart.products.map(prod => ({
            product: prod.product.toObject(),
            quantity: prod.quantity
        }));

        res.render("carts", {products: productsOnCart});
    } catch (error) {
        console.log("ERROR: No se pudo obtener el carrito", error);
        res.status(500).json(
            {status: "error", error: "Internal Server Error"}
        );
    }
})

router.get("/login", (req, res) => {
    if(req.session.login) {
        return res.redirect("/profile");
    }
    res.render("login");
})

router.get("/profile", (req, res) => {
    if(!req.session.login) {
        return res.redirect("/login");
    }
    res.render("profile", { user: req.session.user });
})

router.get("/register", (req, res) => {
    if(req.session.login) {
        return res.redirect("/profile");
    }
    res.render("register");
})

module.exports = router;