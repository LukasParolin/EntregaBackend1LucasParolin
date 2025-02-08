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
            this.products = JSON.parse(data);
            if (this.products.length > 0) {
                this.nextId = Math.max(...this.products.map(p => p.id)) + 1;
            }
        } catch (error) {
            // Si el archivo no existe, se creará al guardar el primer producto
            this.products = [];
        }
    }

    async saveToFile() {
        await fs.writeFile(this.path, JSON.stringify(this.products, null, 2));
    }

    async addProduct(productData) {
        const { title, description, code, price, stock, category, thumbnails = [], status = true } = productData;

        // Validar campos obligatorios
        if (!title || !description || !code || !price || !stock || !category) {
            throw new Error("Todos los campos son obligatorios excepto thumbnails y status");
        }

        // Validar que no se repita el código
        if (this.products.some(product => product.code === code)) {
            throw new Error("El código del producto ya existe");
        }

        // Crear el nuevo producto
        const newProduct = {
            id: this.nextId,
            title,
            description,
            code,
            price,
            status,
            stock,
            category,
            thumbnails
        };

        this.products.push(newProduct);
        this.nextId++;
        await this.saveToFile();
        return newProduct;
    }

    async getProducts() {
        try {
            const data = await fs.readFile(this.path, 'utf-8');
            return JSON.parse(data);
        } catch (error) {
            return [];
        }
    }

    async getProductById(id) {
        try {
            const data = await fs.readFile(this.path, 'utf-8');
            const products = JSON.parse(data);
            const product = products.find(product => product.id === id);
            
            if (!product) {
                throw new Error("Producto no encontrado");
            }
            return product;
        } catch (error) {
            throw error;
        }
    }

    async updateProduct(id, updateData) {
        const products = await this.getProducts();
        const index = products.findIndex(p => p.id === id);
        
        if (index === -1) {
            throw new Error("Producto no encontrado");
        }

        // Evitar actualización del ID
        const { id: _, ...updateFields } = updateData;
        
        // Actualizar el producto
        this.products[index] = {
            ...this.products[index],
            ...updateFields
        };

        await this.saveToFile();
        return this.products[index];
    }

    async deleteProduct(id) {
        const products = await this.getProducts();
        const index = products.findIndex(p => p.id === id);
        
        if (index === -1) {
            throw new Error("Producto no encontrado");
        }

        this.products.splice(index, 1);
        await this.saveToFile();
    }
}

module.exports = ProductManager; 