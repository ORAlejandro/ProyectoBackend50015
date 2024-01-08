//const { read } = require("fs");

const fs = require("fs").promises;

class ProductManager {

    //static lastId = 0;

    constructor(path) {
        this.products = [];
        this.path = path;
        this.lastId = 0;
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
            id: ++this.lastId,
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

    //Funcion para obtener un producto por ID:
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

    //Funcion para actualizar un producto: Requiere ID y la nueva informacion.
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

    //Funcion para eliminar un producto por ID:
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

    //Funcion para leer el array:
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

    //Funcion para guardar:
    async saveFile(responseArray) {
        try {
            const currentData = await this.readFile();
            const newData = currentData.concat(responseArray);
            await fs.writeFile(this.path, JSON.stringify(newData, null, 2));
        } catch (error) {
            console.log("Error al guardar el archivo: ", error)
        }
    }
};

module.exports = ProductManager;