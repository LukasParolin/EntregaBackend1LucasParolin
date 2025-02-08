const express = require('express');
const router = express.Router();
const ProductManager = require('../managers/ProductManager.js');

// Creamos una instancia del manager para manejar los productos
const productsManager = new ProductManager('./data/products.json');

// Traer productos
router.get('/', async (req, res) => {
    try {
        let productos = await productsManager.getProducts();
        
        // Si hay un límite en la query, lo aplicamos
        if (req.query.limit) {
            productos = productos.slice(0, parseInt(req.query.limit));
        }
        
        res.json({ productos });
    } catch (error) {
        console.log('Error al obtener productos:', error);
        res.status(500).json({ error: 'Error al obtener productos' });
    }
});

// Traer un producto específico
router.get('/:pid', async (req, res) => {
    try {
        const id = parseInt(req.params.pid);
        const producto = await productsManager.getProductById(id);
        
        if (!producto) {
            return res.status(404).json({ error: 'Producto no encontrado' });
        }

        res.json(producto);
    } catch (error) {
        console.log('Error al obtener el producto:', error);
        res.status(500).json({ error: 'Error al obtener el producto' });
    }
});

// Crear producto
router.post('/', async (req, res) => {
    try {
        const nuevoProducto = await productsManager.addProduct(req.body);
        res.status(201).json({ 
            mensaje: 'Producto creado con éxito',
            producto: nuevoProducto 
        });
    } catch (error) {
        console.log('Error al crear producto:', error);
        res.status(400).json({ error: error.message });
    }
});

// Actualizar producto
router.put('/:pid', async (req, res) => {
    try {
        const id = parseInt(req.params.pid);
        const productoActualizado = await productsManager.updateProduct(id, req.body);
        
        res.json({ 
            mensaje: 'Producto actualizado con éxito',
            producto: productoActualizado 
        });
    } catch (error) {
        console.log('Error al actualizar producto:', error);
        res.status(400).json({ error: error.message });
    }
});

// Borrar producto
router.delete('/:pid', async (req, res) => {
    try {
        const id = parseInt(req.params.pid);
        await productsManager.deleteProduct(id);
        res.json({ mensaje: 'Producto eliminado con éxito' });
    } catch (error) {
        console.log('Error al eliminar producto:', error);
        res.status(400).json({ error: error.message });
    }
});

module.exports = router; 