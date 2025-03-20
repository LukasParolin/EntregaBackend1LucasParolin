// Configuración de Handlebars
app.engine('handlebars', exphbs.engine({
    helpers: {
        multiply: function(a, b) {
            return a * b;
        }
    }
})); 