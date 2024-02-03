const ProductModel = require("../models/product.model.js");

class ProductManager {

    async addProduct({ title, description, price, img, code, stock, category, thumbnails }) {
        try {
            if (!title || !description || !price || !code || !stock || !category) {
                console.error("ERROR: Es obligatorio llenar todos los campos")
                return;
            }

            const existProduct = await ProductModel.findOne({ code: code });

            if (existProduct) {
                console.log("ERROR: El codigo debe ser unico");
                return;
            }

            const newProduct = new ProductModel({
                title,
                description,
                price,
                img,
                code,
                stock,
                category,
                status: true,
                thumbnails: thumbnails || []
            });

            await newProduct.save();
        } catch (error) {
            console.log("ERROR: No se pudo agregar el producto", error);
            throw error;
        }
    }

    async getProducts() {
        try {
            const products = await ProductModel.find();

            return products;

        } catch (error) {
            console.log("ERROR: No se pudo obtener los productos", error);
        }
    }

    async getProductById(id) {
        try {
            const product = await ProductModel.findById(id);

            if (!product) {
                console.log("ERROR: Producto no encontrado");
                return null;
            }

            console.log("Producto encontrado");

            return product;

        } catch (error) {
            console.log("ERROR: No se pudo obtener el producto por id", error);
        }
    }

    async updateProduct(id, updatedProduct) {
        try {
            const updated = await ProductModel.findByIdAndUpdate(id, updatedProduct);

            if (!updated) {
                console.log("ERROR: No se encontro el producto");
                return null;
            }

            console.log("Producto actualizado con exitos");
            return updated;

        } catch (error) {
            console.log("ERROR: No se pudo actualizar el producto", error);
        }
    }

    async deleteProduct(id) {
        try {
            const deleted = await ProductModel.findByIdAndDelete(id);
            if (!deleted) {
                console.log("ERROR: No se encontro el producto para eliminar");
                return null;
            }

            console.log("Producto eliminado correctamente");

        } catch (error) {
            console.log("ERROR: No se pudo eliminar el producto", error);
        }
    }
}

module.exports = ProductManager;