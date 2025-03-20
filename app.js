const express = require('express');
const handlebars = require('express-handlebars');
const path = require('path');
const { Server } = require('socket.io');
const { connectDB } = require('./src/config/db');

const app = express();
const PORT = process.env.PORT || 8080;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

app.engine('handlebars', handlebars.engine({
    helpers: {
        multiply: function(a, b) {
            return a * b;
        },
        range: function(start, end) {
            const result = [];
            for (let i = start; i <= end; i++) {
                result.push(i);
            }
            return result;
        },
        eq: function(a, b) {
            return a === b;
        }
    }
}));

app.set('views', path.join(__dirname, 'src/views'));
app.set('view engine', 'handlebars');

connectDB();

app.use('/api/products', require('./src/routes/products.router'));
app.use('/api/carts', require('./src/routes/carts.router'));

const httpServer = app.listen(PORT, () => {
    console.log(`Servidor corriendo en puerto ${PORT}`);
});

const io = new Server(httpServer);
const ProductManager = require('./src/managers/ProductManager');
const productManager = new ProductManager();

io.on('connection', socket => {
    socket.on('addProduct', async product => {
        await productManager.addProduct(product);
        io.emit('updateProducts', await productManager.getProducts());
    });

    socket.on('deleteProduct', async id => {
        await productManager.deleteProduct(id);
        io.emit('updateProducts', await productManager.getProducts());
    });
});

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Algo salió mal!' });
}); 