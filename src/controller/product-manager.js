const fs = require("fs").promises;

class ProductManager {

    constructor(path) {
        this.products = [];
        this.path = path;
        this.lastId = 0;
    }
    
    async addProduct(newObject) {
        let { title, description, price, thumbnail, code, stock, status, category } = newObject;
        if (!title || !description || !price || !thumbnail || !code || !stock || !status || !category) {
            console.error("ERROR: Es obligatorio llenar todos los campos")
            return;
        }

        await this.readFile()
        if (this.products.some(items => items.code === code)) {
            console.error("ERROR: El codigo debe ser unico");
            return;
        }

        const newProduct = {
            id: this.products[this.products.length-1].id + 1,
            title,
            description,
            price,
            thumbnail,
            code,
            stock,
            status,
            category
        };

        this.products.push(newProduct);
        await this.saveFile(this.products);
    };

    async getProducts() {
        try {
          const arrayProductos = await this.readFile();
          return arrayProductos;
        } catch (error) {
          console.log("Error al leer el archivo", error);
          throw error;
        }
      }

    async getProductById(id) {
        try {
            const responseArray = await this.readFile();
            const finded = responseArray.find(item => item.id === id);
            if (!finded) {
                console.log("Producto no encontrado");
            } else {
                console.log("Producto encontrado:");
                return finded;
            }
        } catch (error) {
            console.log("Error al leer el archivo", error)
        }
    }

    async updateProduct(id, updatedProduct) {
        try {
            const responseArray = await this.readFile();
            const index = responseArray.findIndex(item => item.id === id);
            if (index !== -1) {
                this.products[index] = { ...this.products[index], ...updatedProduct, id: id };
                await this.saveFile(responseArray);
            } else {
                console.log("Producto no encontrado")
            }
        } catch (error) {
            console.log("Error al actualizar el producto: ", error)
        }
    }

    async deleteProduct(id) {
        try {
            const responseArray = await this.readFile();
            const index = responseArray.findIndex(item => item.id === id);
            if (index !== -1) {
                responseArray.splice(index, 1);
                await this.saveFile(responseArray);
            }
        } catch (error) {
            console.log("No se pudo borrar el archivo")
        }
    }

    async readFile() {
        try {
            const response = await fs.readFile(this.path, "utf-8")
            this.products = JSON.parse(response);
            return this.products;
        } catch (error) {
            console.log("Hubo un error al leer el archivo: ", error);
        }
    }

    async saveFile(responseArray) {
        try {
            await fs.writeFile(this.path, JSON.stringify(responseArray, null, 2));
        } catch (error) {
            console.log("Error al guardar el archivo: ", error)
        }
    }
};

module.exports = ProductManager;