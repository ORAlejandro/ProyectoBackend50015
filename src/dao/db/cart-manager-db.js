const CartModel = require("../models/cart.model.js");

class CartManager {
    async createCart() {
        try {
            const newCart = new CartModel({products: []});

            await newCart.save();

            return newCart;
        } catch (error) {
            console.log("ERROR: No se pudo crear el nuevo carrito", error);   
        }
    }

    async getCartById(id) {
        try {
            const cart = await CartModel.findById(id);
            if(!cart) {
                console.log("ERROR: No existe un carrito con ese id");
                return null;
            }

            return cart;
        } catch (error) {
            console.log("ERROR: No se pudo encontrar al carrito por id", error);
        }
    }

    async addProductToCart(cartId, productId, quantity = 1) {
        try {
            const cart = await this.getCartById(cartId);

            const existProduct = cart.products.find(item => item.product.toString() === productId);

            if(existProduct) {
                existProduct.quantity += quantity;
            } else {
                cart.products.push({product: productId, quantity});
            }

            cart.markModified("products");

            await cart.save();
            
            return cart;
        } catch (error) {
            console.log("ERROR: No se pudo agregar producto al carrito", error);
        }
    }
}

module.exports = CartManager;