const ProductServices = require("../../services/product.services.js");
const productServices = new ProductServices;

class ProductController {
    async addProduct(req, res) {
        const newProduct = req.body;
        try {
            const result = await productServices.addProduct(newProduct);
            res.json({
                status: "success",
                message: "producto agregado correctamente",
                result,
            });
        } catch (error) {
            res.status(500).send("Error al agregar producto (f/controller)");
        }
    }

    async getProducts(req, res) {
        try {
            let { limit = 10, page = 1, sort, query } = req.query;
            const products = await productServices.getProducts(limit, page, sort, query);
            res.json({
                status: "success",
                message: "producto obtenido correctamente",
                products,
            });
        } catch (error) {
            res.status(500).send("Error al obtener producto (f/controller)");
        }
    }

    async getProductsById(req, res) {
        const id = req.params.pid;
        try {
            const finded = await productServices.getProductsById(id);
            if(!finded) {
                return res.status(404).json({ error: "producto no encontrado (f/controller)" });
            }
            res.json({
                status: "success",
                message: "producto encontrado correctamente",
                finded,
            });
        } catch (error) {
            res.status(500).send("Error al obtener producto por id (f/controller)");
        }
    }

    async updateProduct(req, res) {
        const id = req.params.pid;
        const updatedProduct = req.body;
        try {
            const result = await productServices.updateProduct(id, updatedProduct);
            res.json({
                status: "success",
                message: "producto actualizado correctamente",
                result,
            });
        } catch (error) {
            res.status(500).send("Error al actualizar el producto (f/controller)");
        }
    }

    async deleteProduct(req, res) {
        const id = req.params.pid;
        try {
            const response = await productServices.deleteProduct(id);
            res.json({
                status: "success",
                message: "producto eliminado correctamente",
                response,
            })
        } catch (error) {
            res.status(500).send("Error al eliminar el producto (f/controller)");
        }
    }
}

module.exports = ProductController;