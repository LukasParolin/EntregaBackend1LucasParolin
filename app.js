const express = require('express');
const { Server } = require('socket.io');
const handlebars = require('express-handlebars');
const path = require('path');
const app = express();

const productosRouter = require('./src/routes/products.router.js');
const carritosRouter = require('./src/routes/carts.router.js');
const viewsRouter = require('./src/routes/views.router.js');

const PORT = 8080;

app.engine('handlebars', handlebars.engine());
app.set('views', path.join(__dirname, 'src/views'));
app.set('view engine', 'handlebars');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'src/public')));

app.use('/', viewsRouter);
app.use('/api/products', productosRouter);
app.use('/api/carts', carritosRouter);

app.use('*', (req, res) => {
    res.status(404).json({ error: 'Ruta no encontrada' });
});

app.use((err, req, res, next) => {
    res.status(500).json({ error: 'Error interno del servidor' });
});

const httpServer = app.listen(PORT, () => {
    console.log(`Servidor activo en http://localhost:${PORT}`);
});

const io = new Server(httpServer);

io.on('connection', async (socket) => {
    const ProductManager = require('./src/managers/ProductManager');
    const productManager = new ProductManager('./data/products.json');
    
    const products = await productManager.getProducts();
    socket.emit('updateProducts', products);
    
    socket.on('addProduct', async (productData) => {
        try {
            await productManager.addProduct(productData);
            const updatedProducts = await productManager.getProducts();
            io.emit('updateProducts', updatedProducts);
        } catch (error) {
            socket.emit('error', { message: error.message });
        }
    });
    
    socket.on('deleteProduct', async (productId) => {
        try {
            await productManager.deleteProduct(productId);
            const updatedProducts = await productManager.getProducts();
            io.emit('updateProducts', updatedProducts);
        } catch (error) {
            socket.emit('error', { message: error.message });
        }
    });
}); 