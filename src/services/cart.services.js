const CartModel = require("../dao/models/cart.model.js");

class CartServices {
    async createCart() {
        try {
            const newCart = new CartModel({products: []});
            await newCart.save();
            return newCart;
        } catch (error) {
            throw new Error("Error al intentar crear el carrito");
        }
    }

    async getProductsFromCart(idCart) {
        try {
            const cart = await CartModel.findById(idCart);
            if(!cart) {
                console.log("No existe un carrito con ese ID");
                return null;
            }
            return cart;
        } catch (error) {
            throw new Error("Error al intentar obtener los productos del carrito");
        }
    }

    async addProduct(cartId, productId, quantity = 1) {
        try {
            const cart = await this.getProductsFromCart(cartId);
            const existingProduct = cart.products.find(item => item.product._id.toString() === productId);
            if(existingProduct) {
                existingProduct.quantity += quantity;
            } else {
                cart.products.push({ product: productId, quantity });
            }
            cart.markModified("products");
            await cart.save();
            return cart;
        } catch (error) {
            throw new Error("Error al intentar agregar un producto");
        }
    }

    async deleteProduct(cartId, productId) {
        try {
            const cart = await CartModel.findById(cartId);
            if(!cart) {
                console.log("Carrito no encontrado", error);
            }
            cart.products = cart.products.filter(item => item.product._id.toString() !== productId);
            await cart.save();
            return cart;
        } catch (error) {
            throw new Error("Error al intentar eliminar el producto");
        }
    }

    async updateProductInCart(cartId, updatedProducts) {
        try {
            const cart = await CartModel.findById(cartId);
            if(!cart) {
                console.log("Carrito no encontrado", error);
            }
            cart.products = updatedProducts;
            cart.markModified("products");
            await cart.save();
            return cart;
        } catch (error) {
            throw new Error("Erro al intentar actualizar un producto en el carrito");
        }
    }

    async updateQuantityInCart(cartId, productId, newQuantity) {
        try {
            const cart = await CartModel.findById(cartId);
            if(!cart) {
                console.log("Carrito no encontrado", error);
            }
            const productIndex = cart.products.findIndex(item => item._id.toString() === productId);
            if(productIndex !== -1) {
                cart.products[productIndex].quantity = newQuantity;
                cart.markModified("products");
                await cart.save();
                return cart;
            } else {
                console.log("Producto no encontrado en el carrito", error);
            }
        } catch (error) {
            throw new Error("Error al intentar actualizar la cantidad de un producto");
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
                console.log("Carrito no encontrado", error);
            }
            return cart;
        } catch (error) {
            throw new Error("Error al intentar vaciar el carrito");
        }
    }
}

module.exports = CartServices;