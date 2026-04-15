import conexion from './db.js';

var categoriasDB = {};

// Obtener todas las categorías
categoriasDB.obtenerTodas = function() {
    return new Promise((resolve, reject) => {
        conexion.query('SELECT * FROM categorias', (err, resultado) => {
            if (err) reject(err);
            else resolve(resultado);
        });
    });
};

// Obtener por ID
categoriasDB.obtenerPorId = function(id) {
    return new Promise((resolve, reject) => {
        conexion.query('SELECT * FROM categorias WHERE id = ?', [id], (err, resultado) => {
            if (err) reject(err);
            else resolve(resultado[0]);
        });
    });
};

// Eliminar
categoriasDB.eliminar = function(id) {
    return new Promise((resolve, reject) => {
        conexion.query('DELETE FROM categorias WHERE id = ?', [id], (err, resultado) => {
            if (err) reject(err);
            else resolve(resultado);
        });
    });
};

categoriasDB.habilitar = function(id) {
    return new Promise((resolve, reject) => {
        conexion.query('UPDATE categorias SET status = 1 WHERE id = ?', [id], (err, resultado) => {
            if (err) reject(err);
            else resolve(resultado);
        });
    });
};

// Insertar
categoriasDB.insertar = function(categoria) {
    return new Promise((resolve, reject) => {
        conexion.query('INSERT INTO categorias SET ?', categoria, (err, resultado) => {
            if (err) reject(err);
            else resolve(resultado.insertId);
        });
    });
};

// Actualizar
categoriasDB.actualizar = function(id, categoria) {
    return new Promise((resolve, reject) => {
        conexion.query('UPDATE categorias SET ? WHERE id = ?', [categoria, id], (err, resultado) => {
            if (err) reject(err);
            else resolve(resultado);
        });
    });
};

categoriasDB.obtenerActivas = function() {
    return new Promise((resolve, reject) => {
        conexion.query('SELECT * FROM categorias WHERE status = 1', (err, resultado) => {
            if (err) reject(err);
            else resolve(resultado);
        });
    });
};

// Deshabilitar
categoriasDB.deshabilitar = function(id) {
    return new Promise((resolve, reject) => {
        conexion.query('UPDATE categorias SET status = 0 WHERE id = ?', [id], (err, resultado) => {
            if (err) reject(err);
            else resolve(resultado);
        });
    });
};

export default categoriasDB;
