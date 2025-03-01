const fs = require('fs').promises;

class ProductManager {
    constructor(path) {
        this.path = path;
        this.products = [];
        this.nextId = 1; // Para manejar el id autoincrementable
        this.initialize();
    }

    async initialize() {
        try {
            const data = await fs.readFile(this.path, 'utf-8');
            const fileContent = JSON.parse(data);
            this.products = fileContent.products || [];
            if (this.products.length > 0) {
                this.nextId = Math.max(...this.products.map(p => p.id)) + 1;
            }
        } catch (error) {
            // Si el archivo no existe, se creará al guardar el primer producto
            this.products = [];
        }
    }

    async saveToFile() {
        await fs.writeFile(this.path, JSON.stringify({ products: this.products }, null, 2));
    }

    async addProduct(productData) {
        const { title, description, price, stock, category } = productData;

        if (!title || !description || !price || !stock || !category) {
            throw new Error("Todos los campos son obligatorios");
        }

        const newProduct = {
            id: this.nextId++,
            title,
            description,
            price: Number(price),
            stock: Number(stock),
            category
        };

        this.products.push(newProduct);
        await this.saveToFile();
        return newProduct;
    }

    async getProducts() {
        try {
            const data = await fs.readFile(this.path, 'utf-8');
            const fileContent = JSON.parse(data);
            return fileContent.products || [];
        } catch (error) {
            return [];
        }
    }

    async getProductById(id) {
        const product = this.products.find(p => p.id === id);
        if (!product) {
            throw new Error("Producto no encontrado");
        }
        return product;
    }

    async updateProduct(id, updateData) {
        const index = this.products.findIndex(p => p.id === id);
        if (index === -1) {
            throw new Error("Producto no encontrado");
        }

        const { id: _, ...updateFields } = updateData;
        this.products[index] = {
            ...this.products[index],
            ...updateFields
        };

        await this.saveToFile();
        return this.products[index];
    }

    async deleteProduct(id) {
        const index = this.products.findIndex(p => p.id === Number(id));
        if (index === -1) {
            throw new Error("Producto no encontrado");
        }

        this.products.splice(index, 1);
        await this.saveToFile();
    }
}

module.exports = ProductManager; 