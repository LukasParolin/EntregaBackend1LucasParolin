const Product = require('../models/Product');

class ProductManager {
    async getProducts({ limit = 10, page = 1, sort, query } = {}) {
        try {
            const options = {
                page: parseInt(page),
                limit: parseInt(limit),
                sort: sort === 'desc' ? { price: -1 } : sort === 'asc' ? { price: 1 } : undefined
            };

            const filter = {};
            if (query) {
                filter.category = query;
            }

            const result = await Product.paginate(filter, options);

            const baseUrl = '/api/products';
            const totalPages = result.totalPages;
            const prevPage = result.prevPage;
            const nextPage = result.nextPage;
            const currentPage = result.page;
            const hasPrevPage = result.hasPrevPage;
            const hasNextPage = result.hasNextPage;
            const prevLink = hasPrevPage ? `${baseUrl}?page=${prevPage}&limit=${limit}${sort ? `&sort=${sort}` : ''}${query ? `&query=${query}` : ''}` : null;
            const nextLink = hasNextPage ? `${baseUrl}?page=${nextPage}&limit=${limit}${sort ? `&sort=${sort}` : ''}${query ? `&query=${query}` : ''}` : null;

            return {
                status: 'success',
                payload: result.docs,
                totalPages,
                prevPage,
                nextPage,
                page: currentPage,
                hasPrevPage,
                hasNextPage,
                prevLink,
                nextLink
            };
        } catch (error) {
            throw new Error('Error al obtener productos');
        }
    }

    async getProductById(id) {
        try {
            const product = await Product.findById(id);
            if (!product) {
                throw new Error('Producto no encontrado');
            }
            return product;
        } catch (error) {
            throw new Error('Error al obtener el producto');
        }
    }

    async addProduct(productData) {
        try {
            const product = new Product(productData);
            await product.save();
            return product;
        } catch (error) {
            throw new Error('Error al agregar el producto');
        }
    }

    async updateProduct(id, productData) {
        try {
            const product = await Product.findByIdAndUpdate(id, productData, { new: true });
            if (!product) {
                throw new Error('Producto no encontrado');
            }
            return product;
        } catch (error) {
            throw new Error('Error al actualizar el producto');
        }
    }

    async deleteProduct(id) {
        try {
            const product = await Product.findByIdAndDelete(id);
            if (!product) {
                throw new Error('Producto no encontrado');
            }
            return product;
        } catch (error) {
            throw new Error('Error al eliminar el producto');
        }
    }
}

module.exports = ProductManager; 