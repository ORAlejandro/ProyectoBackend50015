const CartServices = require("../../services/cart.services.js");
const cartServices = new CartServices;
const TicketModel = require("../models/ticket.model.js");
const UserModel = require("../models/user.model.js");
const ProductServices = require("../../services/product.services.js");
const productServices = new ProductServices;
const { generateUniqueCode, calculateTotal } = require("../../utils/cart.utils.js");

class CartController {
    async newCart(req, res) {
        try {
            const newCart = await cartServices.createCart();
            res.json({
                status: "success",
                message: "El carrito fue creado correctamente",
                newCart,
            });
        } catch (error) {
            res.status(500).send("Error al crear el carrito (f/controller)");
        }
    }

    async getProductsFromCart(req, res) {
        const cartId = req.params.cid;
        try {
            const products = await cartServices.getProductsFromCart(cartId);
            if(!products) {
                return res.status(404).json({ error: "Carrito no encontrado (f/controller)" });
            }
            res.json({
                status: "success",
                message: "Productos obtenidos correctamente",
                products,
            });
        } catch (error) {
            res.status(500).send("Error al obtener productos del carrito (f/controller)");
        }
    }
    async addProductToCart(req, res) {
        const cartId = req.params.cid;
        const productId = req.params.pid;
        const quantity = req.body.quantity || 1;
        try {
            await cartServices.addProduct(cartId, productId, quantity);
            const cartID = (req.user.cart).toString();
            //A modificar, este redireccionamiento nos envia al carrito cada vez que agregamos un producto al mismo
            res.redirect(`/carts/${cartID}`);
        } catch (error) {
            res.status(500).send("Error al agregar producto al carrito (f/controller)");
        }
    }

    async deleteProductFromCart(req, res) {
        const cartId = req.params.cid;
        const productId = req.params.pid;
        try {
            const updatedCart = await cartServices.deleteProduct(cartId, productId);
            res.json({
                status: "success",
                message: "El producto fue eliminado correctamente",
                updatedCart,
            });
        } catch (error) {
            res.status(500).send("Error al eliminar producto del carrito (f/controller)");
        }
    }

    async updateProductsFromCart(req, res) {
        const cartId = req.params.cid;
        const updatedProducts = req.body;
        try {
            const updatedCart = await cartServices.updateProductInCart(cartId, updatedProducts);
            res.json({
                status: "success",
                message: "El producto en carrito fue actualizado correctamente",
                updatedCart,
            });
        } catch (error) {
            res.status(500).send("Error al intentar actualizar un producto (f/controller)");
        }
    }

    async updateQuantity(req, res) {
        const cartId = req.params.cid;
        const productId = req.params.pid;
        const newQuantity = req.body.quantity;
        try {
            const updatedCart = await cartServices.updateQuantityInCart(cartId, productId, newQuantity);
            res.json({
                status: "success",
                message: "La cantidad del producto se actualizo correctamente",
                updatedCart,
            });
        } catch (error) {
            res.status(500).send("Error al actualizar la cantidad (f/controller)");
        }
    }

    async clearCart(req, res) {
        const cartId = req.params.cid;
        try {
            const updatedCart = await cartServices.clearCart(cartId);
            res.json({
                status: "success",
                message: "El carrito fue vaciado por completo correctamente",
                updatedCart,
            });
        } catch (error) {
            res.status(500).send("Error al vaciar el carrito (f/controller)");
        }
    }

    async finalizePurchase(req, res) {
        const cartId = req.params.cid;
        try {
            const cart = await cartServices.getProductsFromCart(cartId);
            const products = cart.products;
            const productsNotAvailable = [];
            for(const item of products) {
                const productId = item.product;
                const product = await productServices.getProductsById(productId);
                if(product.stock >= item.quantity) {
                    product.stock -= item.quantity;
                    await product.save();
                } else {
                    productsNotAvailable.push(productId);
                }
            }
            const userWithCart = await UserModel.findOne({ cart: cartId });
            const ticket = new TicketModel({
                code: generateUniqueCode(),
                purchase_datetime: new Date(),
                amount: calculateTotal(cart.products),
                purchaser: userWithCart._id
            });
            await ticket.save();
            cart.products = cart.products.filter(item => productsNotAvailable.some(productId => productId.equals(item.product)));
            await cart.save();
            res.status(200).json({
                message: "productos no disponibles",
                productsNotAvailable,
            });
        } catch (error) {
            res.status(500).send("Error al finalizar la compra");
        }
    }
}

module.exports = CartController;