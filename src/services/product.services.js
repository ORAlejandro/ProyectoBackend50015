const ProductModel = require("../dao/models/product.model.js");

class ProductServices {
    async addProduct({ title, description, price, img, code, stock, category, thumbnails }) {
        try {
            if(!title || !description || !price || !code || !stock || !category) {
                console.log("Failed: Todos los campos son obligatorios");
                return;
            }
            const existingProduct = await ProductModel.findOne({ code: code});
            if(existingProduct) {
                console.log("Failed: El code ya existe, debe ser unico");
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
            return newProduct;
        } catch (error) {
            throw new Error("Error al crear el producto");
        }
    }

    async getProducts(limit = 10, page = 1, sort, query) {
        try {
            const skip = (page - 1) * limit;
            let queryOptions = {};
            if(query) {
                queryOptions = { category: query };
            }
            const sortOptions = {};
            if(sort) {
                if(sort === 'asc' || sort === 'desc') {
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
            throw new Error("Error al obtener los productos")
        }
    }

    async getProductsById(id) {
        try {
            const product = await ProductModel.findById(id);
            if(!product) {
                console.log("Failed: No existe un producto con ese id");
            }
            console.log("Success: Producto encontrado con exito");
            return product;
        } catch (error) {
            throw new Error("Error al obtener el producto mediante el id")
        }
    }

    async updateProduct(id, updatedProduct) {
        try {
            const updated = await ProductModel.findByIdAndUpdate(id, updatedProduct);
            if(!updated) {
                console.log("Failed: Producto no encontrado para actualizar");
                return null;
            }
            console.log("Success: Producto actualizado correctamente");
            return updated;
        } catch (error) {
            throw new Error("Error al actualizar el producto");
        }
    }

    async deleteProduct(id) {
        try {
            const toDelete = await ProductModel.findByIdAndDelete(id);
            if(!toDelete) {
                console.log("Failed: No se pudo eliminar el producto");
                return null;
            }
            console.log("Success: Producto eliminado correctamente");
            return toDelete;
        } catch (error) {
            throw new Error("Erro al eliminar el producto");
        }
    }
}

module.exports = ProductServices;