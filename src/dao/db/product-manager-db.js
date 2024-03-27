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

    async getProducts({ limit = 10, page = 1, sort, query } = {}) {
        try {
            const skip = (page - 1) * limit;

            let queryOptions = {};

            if (query) {
                queryOptions = { category: query };
            }

            const sortOptions = {};
            if (sort) {
                if (sort === 'asc' || sort === 'desc') {
                    sortOptions.price = sort === 'asc' ? 1 : -1;
                }
            }

            const products = await ProductModel
                .find(queryOptions)
                .sort(sortOptions)
                .skip(skip)
                .limit(limit);

            const totalProducts = await ProductModel.countDocuments(queryOptions);

            const totalPages = Math.ceil(totalProducts / limit);
            const hasPrevPage = page > 1;
            const hasNextPage = page < totalPages;

            return {
                docs: products,
                totalPages,
                prevPage: hasPrevPage ? page - 1 : null,
                nextPage: hasNextPage ? page + 1 : null,
                page,
                hasPrevPage,
                hasNextPage,
                prevLink: hasPrevPage ? `/api/products?limit=${limit}&page=${page - 1}&sort=${sort}&query=${query}` : null,
                nextLink: hasNextPage ? `/api/products?limit=${limit}&page=${page + 1}&sort=${sort}&query=${query}` : null,
            };
        } catch (error) {
            console.log("ERROR: No se pudo obtener los productos", error);
            throw error;
        }
    }

    /*getProductById = async (req, res) => {
        const id = req.params.pid;
        try {
            const product = await ProductModel.findById(id);
            if(!product) {
                return res.json({error: "ERROR: Producto no encontrado"})
            }
            res.json(product);
        } catch (error) {
            console.log("ERROR: No se pudo obtener el producto por id", error);
            res.status(500).json({
                error: "ERROR: El servidor no pudo encontrar el producto"
            });
        }
    }*/

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