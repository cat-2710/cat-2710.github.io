import conexion from './db.js';

var productosDB = {};

// Obtener todos los productos
productosDB.obtenerTodos = function() {
    return new Promise((resolve, reject) => {
        conexion.query('SELECT p.*, c.nombre as categoria FROM productos p JOIN categorias c ON p.id_categoria = c.id', (err, resultado) => {
            if (err) reject(err);
            else resolve(resultado);
        });
    });
};

productosDB.obtenerActivos = function() {
    return new Promise((resolve, reject) => {
        conexion.query('SELECT p.*, c.nombre as categoria FROM productos p JOIN categorias c ON p.id_categoria = c.id WHERE p.status = 1', (err, resultado) => {
            if (err) reject(err);
            else resolve(resultado);
        });
    });
};

// Obtener por categoría
productosDB.obtenerPorCategoria = function(id_categoria) {
    return new Promise((resolve, reject) => {
        conexion.query('SELECT * FROM productos WHERE id_categoria = ? AND status = 1', [id_categoria], (err, resultado) => {
            if (err) reject(err);
            else resolve(resultado);
        });
    });
};

// Obtener por ID
productosDB.obtenerPorId = function(id) {
    return new Promise((resolve, reject) => {
        conexion.query('SELECT * FROM productos WHERE id = ?', [id], (err, resultado) => {
            if (err) reject(err);
            else resolve(resultado[0]);
        });
    });
};

// Insertar
productosDB.insertar = function(producto) {
    return new Promise((resolve, reject) => {
        conexion.query('INSERT INTO productos SET ?', producto, (err, resultado) => {
            if (err) reject(err);
            else resolve(resultado.insertId);
        });
    });
};

// Actualizar
productosDB.actualizar = function(id, producto) {
    return new Promise((resolve, reject) => {
        conexion.query('UPDATE productos SET ? WHERE id = ?', [producto, id], (err, resultado) => {
            if (err) reject(err);
            else resolve(resultado);
        });
    });
};

// Deshabilitar
productosDB.deshabilitar = function(id) {
    return new Promise((resolve, reject) => {
        conexion.query('UPDATE productos SET status = 0 WHERE id = ?', [id], (err, resultado) => {
            if (err) reject(err);
            else resolve(resultado);
        });
    });
};

productosDB.habilitar = function(id) {
    return new Promise((resolve, reject) => {
        conexion.query('UPDATE productos SET status = 1 WHERE id = ?', [id], (err, resultado) => {
            if (err) reject(err);
            else resolve(resultado);
        });
    });
};

productosDB.eliminar = function(id) {
    return new Promise((resolve, reject) => {
        conexion.query('DELETE FROM productos WHERE id = ?', [id], (err, resultado) => {
            if (err) reject(err);
            else resolve(resultado);
        });
    });
};

export default productosDB;
