const express = require('express');
const router = express.Router();

// Importamos los managers que vamos a usar
const CartManager = require('../managers/CartManager');
const ProductManager = require('../managers/ProductManager.js');
const { getCartView } = require('../controllers/cart.controller');

// Creamos las instancias necesarias
const cartManager = new CartManager();
const productManager = new ProductManager();

// Crear carrito nuevo
router.post('/', async (req, res) => {
    try {
        const newCart = await cartManager.createCart();
        res.status(201).json(newCart);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Ver un carrito
router.get('/:cid', getCartView);

// Agregar producto al carrito
router.post('/:cid/products/:pid', async (req, res) => {
    try {
        const { quantity = 1 } = req.body;
        const cart = await cartManager.addProductToCart(
            req.params.cid,
            req.params.pid,
            parseInt(quantity)
        );
        res.json(cart);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

router.put('/:cid', async (req, res) => {
    try {
        const cart = await cartManager.updateCartProducts(req.params.cid, req.body);
        res.json(cart);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

router.put('/:cid/products/:pid', async (req, res) => {
    try {
        const { quantity } = req.body;
        const cart = await cartManager.updateProductQuantity(
            req.params.cid,
            req.params.pid,
            parseInt(quantity)
        );
        res.json(cart);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

router.delete('/:cid/products/:pid', async (req, res) => {
    try {
        const cart = await cartManager.removeProductFromCart(
            req.params.cid,
            req.params.pid
        );
        res.json(cart);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

router.delete('/:cid', async (req, res) => {
    try {
        const cart = await cartManager.clearCart(req.params.cid);
        res.json(cart);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

module.exports = router; 