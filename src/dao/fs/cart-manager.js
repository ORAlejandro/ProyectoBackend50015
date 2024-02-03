const fs = require("fs").promises;

class CartManager {
    constructor(path) {
        this.path = path;
        this.carts = [];
        this.lastId = 0;

        this.loadCarts();
    }

    async loadCarts() {
        try {
            const data = await fs.readFile(this.path, "utf-8");
            this.carts = JSON.parse(data);
            if(this.carts.length > 0) {
                this.lastId = Math.max(...this.carts.map(cart => cart.id));
            }
        } catch (error) {
            console.error("Hubo un error al cargar los carritos");
            await this.saveCarts();
        }
    }

    async saveCarts() {
        await fs.writeFile(this.path, JSON.stringify(this.carts, null, 2));
    }

    async createCart() {
        const newCart = {
            id: ++this.lastId,
            products: []
        };

        this.carts.push(newCart);

        await this.saveCarts();
        return newCart;
    }

    async getCartById(cartId) {
        try {
            const cart = this.carts.find(cart => cart.id === cartId);
            if(!cart) {
                throw new Error(`El carrito con ese ID no existe`);
            }
            return cart;
        } catch (error) {
            console.error("No se encontro un carrito con ese ID");
        }
    }
    
    async addProductToCart(cartId, productId, quantity = 1) {
        const cart = await this.getCartById(cartId);
        const existeProducto = cart.products.find(pr => pr.product === productId);

        if(existeProducto) {
            existeProducto.quantity += quantity;
        } else {
            cart.products.push({ product: productId, quantity });
        }

        await this.saveCarts();
        return cart;
    }
}

module.exports = CartManager;