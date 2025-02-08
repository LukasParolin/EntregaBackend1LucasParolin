const express = require('express');
const app = express();

console.log('Iniciando servidor...');

// Importamos las rutas
const productosRouter = require('./src/routes/products.router.js');
const carritosRouter = require('./src/routes/carts.router.js');

console.log('Rutas importadas correctamente');

// Config básica
const PORT = 8080;

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Ruta raíz
app.get('/', (req, res) => {
    res.json({
        mensaje: 'Bienvenido a la API de ecommerce',
        endpoints: {
            productos: '/api/products',
            carritos: '/api/carts'
        }
    });
});

// Rutas
app.use('/api/products', productosRouter);
app.use('/api/carts', carritosRouter);

// Manejador de rutas no encontradas
app.use('*', (req, res) => {
    console.log('Ruta no encontrada:', req.originalUrl);
    res.status(404).json({ error: 'Ruta no encontrada' });
});

// Middleware para manejo de errores
app.use((err, req, res, next) => {
    console.error('Error:', err);
    res.status(500).json({ error: 'Error interno del servidor' });
});

// Iniciamos el servidor con manejo de errores
const server = app.listen(PORT, () => {
    console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
}).on('error', (error) => {
    if (error.code === 'EADDRINUSE') {
        console.log(`⚠️  El puerto ${PORT} está en uso. Intentando cerrar el proceso...`);
        // Intentamos cerrar el servidor anterior
        server.close(() => {
            console.log('Servidor anterior cerrado.');
            // Intentamos iniciar nuevamente
            server.listen(PORT);
        });
    } else {
        console.error('Error al iniciar el servidor:', error);
        process.exit(1);
    }
}); 