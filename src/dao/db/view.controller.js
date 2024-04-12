const ProductModel = require("../models/product.model.js");
const CartServices = require("../../services/cart.services.js");
const cartServices = new CartServices;

class ViewsController {
    async renderProducts(req, res) {
        try {
            const { page = 1, limit = 3 } = req.query;
            const skip = (page - 1) * limit;
            const products = await ProductModel
                .find()
                .skip(skip)
                .limit(limit);
            const totalProducts = await ProductModel.countDocuments();
            const totalPages = Math.ceil(totalProducts / limit);
            const hasPrevPage = page > 1;
            const hasNextPage = page < totalPages;
            const newArray = products.map(product => {
                const { _id, ...rest } = product.toObject();
                return { id: _id, ...rest };
            });
            const cartId = req.user.cart.toString();
            console.log("Resultado: ", cartId);
            res.render("products", {
                products: newArray,
                hasPrevPage,
                hasNextPage,
                prevPage: page > 1 ? parseInt(page) - 1 : null,
                nextPage: page < totalPages ? parseInt(page) + 1 : null,
                currentPage: parseInt(page),
                totalPages,
                cartId
            });
        } catch (error) {
            console.error("Error en el renderProducts (f/controller)");
            res.status(500).send({
                status: "error",
                message: "Server Internal Error",
            });
        }
    }

    async renderCart(req, res) {
        const cartId = req.params.cid;
        try {
            const cart = await cartServices.getProductsFromCart(cartId);
            if(!cart) {
                console.error("Failed: No hay carrito con ese id");
                return res.status(404).json({
                    status: "error",
                    message: "carrito no encontrado"
                });
            }
            let totalPurchase = 0;
            const productsInCart = cart.products.map(item => {
                const product = item.product.toObject();
                const quantity = item.quantity;
                const totalPrice = product.price * quantity;
                totalPurchase += totalPrice;
                return {
                    product: { ...product, totalPrice },
                    quantity,
                    cartId
                };
            });
            res.render("carts", { products: productsInCart, totalPurchase, cartId });
        } catch (error) {
            console.error("Error en el renderCart (f/controller)");
            res.status(500).send({
                status: "error",
                message: "Server Internal Error"
            });
        }
    }

    async renderLogin(req, res) {
        try {
            res.render("login");
        } catch (error) {
            console.error("Error en el renderLogin: ", error);
            res.status(500).send({
                status: "error",
                message: "error al renderizar el login"
            });
        }
    }

    async renderRegister(req, res) {
        try {
            res.render("register");
        } catch (error) {
            console.error("error al renderizar el register: ", error);
            res.status(500).send({
                status: "error",
                message: "error al renderizar el register"
            });
        }
    }

    async renderRealTimeProducts(req, res) {
        try {
            res.render("realtimeproducts");
        } catch (error) {
            console.error("error en el render real time products: ", error);
            res.status(500).send({
                status: "error",
                message: "error al renderizar el real time products"
            });
        }
    }

    async renderChat(req, res) {
        try {
            res.render("chat");
        } catch (error) {
            console.error("error en el render chat: ", error);
            res.status(500).send({
                status: "error",
                message: "error al renderizar el chat"
            });
        }
    }
    
    async renderHome(req, res) {
        try {
            
        } catch (error) {
            console.error("error en el render home: ", error);
            res.status(500).send({
                status: "error",
                message: "error al renderizar el home"
            });
        }
    }
}

module.exports = ViewsController;