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

    async deleteProductCart(cartId, productId) {
        try {
            const cart = await CartModel.findById(cartId);
            if(!cart) {
                throw new Error("T.ERROR: Carrito no encontrado");
            }
            cart.products = cart.products.filter(item => item.product.toString() !== productId);
            await cart.save();
            return cart;
        } catch (error) {
            console.log("ERROR: Error al intentar eliminar el producto del carrito", error);
            throw error;
        }
    }

    async updateCart(cartId, updateProducts) {
        try {
            const cart = await CartModel.findById(cartId);
            if(!cart) {
                throw new Error("T.ERROR: Carrito no encontrado");
            }
            cart.products = updateProducts;
            cart.markModified("products");
            await cart.save();
            return cart;
        } catch (error) {
            console.log("ERROR: Error al intentar actualizar el carrito", error);
            throw error;
        }
    }

    async updateProductQuantity(cartId, productId, newQuantity) {
        try {
            const cart = await CartModel.findById(cartId);
            if(!cart) {
                throw new Error("T.ERROR: Carrito no encontrado");
            }
            const productIndex = cart.products.findIndex(item => item.product.toString() === productId);
            if(productIndex !== -1) {
                cart.products[productIndex].quantity = newQuantity;
                cart.markModified("products");
                await cart.save();
                return cart;
            }
        } catch (error) {
            console.log("ERROR: No se pudo actualizar la cantidad del producto", error);
            throw error;
        }
    }

    async clearCart(cartId) {
        try {
            const cart = await CartModel.findByIdAndUpdate(
                cartId,
                { products: [] },
                { new: true }
            );
            if(!cart) {
                throw new Error("T.ERROR: Carrito no encontrado");
            }
            return cart;
        } catch (error) {
            console.log("ERROR: No se pudo vaciar el carrito", error);
            throw error;
        }
    }
}

module.exports = CartManager;