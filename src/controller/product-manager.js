//const { read } = require("fs");

const fs = require("fs").promises;

class ProductManager {

    static lastId = 0;

    constructor(path) {
        this.products = [];
        this.path = path;
    }

    async readFile() {
        try {
            const response = await fs.readFile(this.path, "utf-8")
            //this.products = JSON.parse(response);
            const responseArray = JSON.parse(response);
            return responseArray;

        } catch (error) {
            console.log("Hubo un error al leer el archivo: ", error);
        }
    }

    
    async saveFile(responseArray) {
        try {
            const currentData = await this.readFile();
            const newData = currentData.concat(responseArray);
            await fs.writeFile(this.path, JSON.stringify(newData, null, 2));
        } catch (error) {
            console.log("Error al guardar el archivo: ", error)
        }
    }
    

    /* TEST NEGATIVO
    async saveFile() {
        try {
            await fs.writeFile(this.path, JSON.stringify(this.products, null, 2), "utf-8");
        } catch (error) {
            console.log("Error al guardar el archivo: ", error)
        }
    }
    */
    

    async addProduct(newObject) {

        let { title, description, price, thumbnail, code, stock, status, category } = newObject;

        if (!title || !description || !price || !thumbnail || !code || !stock || !status || !category) {
            console.error("ERROR: Es obligatorio llenar todos los campos")
            return;
        }

        if (this.products.some(items => items.code === code)) {
            console.error("ERROR: El codigo debe ser unico");
            return;
        }

        const newProduct = {
            id: ++ProductManager.lastId,
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

    getProducts() {
        console.log(this.products);
    };

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
                responseArray.splice(index, 1, updatedProduct);
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
};

module.exports = ProductManager;