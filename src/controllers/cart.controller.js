const CartManager = require('../managers/CartManager');
const cartManager = new CartManager();

const getCartView = async (req, res) => {
    try {
        const cartId = req.params.cid;
        const cart = await cartManager.getCartById(cartId);
        res.render('cart', { cart });
    } catch (error) {
        res.status(404).render('error', { message: 'Carrito no encontrado' });
    }
};

module.exports = {
    getCartView
}; 