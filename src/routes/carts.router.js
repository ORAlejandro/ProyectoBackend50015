const express = require("express");
const router = express.Router();
const CartManager = require("../dao/db/cart-manager-db.js");
const cartManager = new CartManager();
const CartModel = require("../dao/models/cart.model.js");

//Crear nuevo carrito:
router.post("/", async (req, res) => {
    try {
        const newCart = await cartManager.createCart();
        res.json(newCart);
    } catch (error) {
        console.error("ERROR: No se pudo crear un nuevo carrito");
        res.json({status: "error"});
    }
});

//Listar productos de X carrito
router.get("/:cid", async (req, res) => {
    const cartId = req.params.cid;
    try {
        const cart = await CartModel.findById(cartId)
        if(!cart) {
            console.log("ERROR: No existe un carrito con ese id");
            return res.status(406).json(
                {error: "Carrito no encontrado"}
            )
        }
        return res.json(cart.products);
    } catch (error) {
        console.error("ERROR: No se pudo obtener el carrito");
        res.status(500).res.json(
            {status: "error"}
        );
    }
});

//Agregar producto X a X carrito
router.post("/:cid/product/:pid", async (req, res) => {
    const cartId = req.params.cid;
    const productId = req.params.pid;
    const quantity = req.body.quantity || 1;

    try {
        const updateCart = await cartManager.addProductToCart(cartId, productId, quantity);
        res.json(updateCart.products);
    } catch (error) {
        console.log("ERROR: Error al actualizador el carrito", error);
        res.status(500).json({error: "ERROR: Error del servidor al intentar actualizar el carrito"})
    }
});

//Eliminar producto X de carrito X
router.delete("/:cid/product/:pid", async (req, res) => {
    try {
        const cartId = req.params.cid;
        const productId = req.params.pid;
        const updatedCart = await cartManager.deleteProductCart(cartId, productId);
        res.json({status: "success", message: "Producto eliminado correctamente", updatedCart});
    } catch (error) {
        console.log("ERROR: No se pudo eliminar el producto del carrito", error);
        res.status(500).json({status: "error", error: "Internal Server Error"});
    }
})

//Actualizar productos de X carrito
router.put("/:cid", async (req, res) => {
    const cartId = req.params.cid;
    const updatedProducts = req.body;
    try {
        const updatedCart = await cartManager.updateCart(cartId, updatedProducts);
        res.json({
            status: "success", message: "Actualizado con exito", updatedCart
        });
    } catch (error) {
        console.log("ERROR: No se pudo actualizar el carrito", error);
        res.status(500).json(
            {status: "error", error: "Internal Server Error"}
        );
    }
})

//Actualizar la cantidad de productos
router.put("/:cid/product/:pid", async (req, res) => {
    try {
        const cartId = req.params.cid;
        const productId = req.params.pid;
        const newQuantity = req.body.quantity;

        const updatedCart = await cartManager.updateProductQuantity(cartId, productId, newQuantity);
        res.json(
            {status: "success", message: "La cantidad del producto se actualizo con exito", updatedCart}
        );
    } catch (error) {
        console.log("ERROR: No se logro actualizar con exito las cantidades", error);
        res.status(500).json(
            {status: "error", error: "Internal Server Error"}
        )
    }
})

//Vaciar carrito
router.delete("/:cid", async (req, res) => {
    try {
        const cartId = req.params.cid;
        
        const updatedCart = await cartManager.clearCart(cartId);
        res.json(
            {status: "success", message: "El carrito fue vaciado con exito", updatedCart}
        );
    } catch (error) {
        console.log("ERROR: No se pudo vaciar el carrito", error);
        res.status(500).json(
            {status: "error", error: "Internal Server Error"}
        );
    }
})

module.exports = router;