import { body, param, validationResult } from 'express-validator';
import express from 'express';
import productosDB from '../models/productos.js';
import multer from 'multer';
import path from 'path';
import { verificarToken } from './authMiddleware.js';

const router = express.Router();

const validarCampos = (req, res, next) => {
    const errores = validationResult(req);
    if (!errores.isEmpty()) {
        return res.status(400).json({
            status: "error",
            errores: errores.array()
        });
    }
    next();
};

// Configuracion para subir imagenes
const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, 'public/img/productos/');
    },
    filename: function(req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const fileFilter = (req, file, cb) => {

    const tiposPermitidos = /jpeg|jpg|png|webp/;
    const extension = tiposPermitidos.test(path.extname(file.originalname).toLowerCase());
    const mimetype = tiposPermitidos.test(file.mimetype);

    if (extension && mimetype) {
        return cb(null, true);
    }

    cb(new Error("Formato de imagen no permitido"));
};

const upload = multer({
    storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
    fileFilter
});

// GET /api/productos
router.get('/', async (req, res) => {
    try {
        const productos = await productosDB.obtenerTodos();
        res.json({ status: 'success', data: productos });
    } catch (error) {
        res.status(500).json({ status: 'error', message: 'Error al obtener productos' });
    }
});

// GET /api/productos/categoria/:id
router.get('/categoria/:id',
[
    param('id')
        .isInt().withMessage('El ID de categoria debe ser numérico')
        .toInt()
],
validarCampos,async (req, res) => {
    try {
        const productos = await productosDB.obtenerPorCategoria(req.params.id);
        res.json({ status: 'success', data: productos });
    } catch (error) {
        res.status(500).json({ status: 'error', message: 'Error al obtener productos por categoría' });
    }
});

// GET /api/productos/:id
router.get('/:id',
[
    param('id')
        .isInt().withMessage('El ID debe ser un número')
        .toInt()
],
validarCampos,
async (req, res) => {
    try {
        const producto = await productosDB.obtenerPorId(req.params.id);
        if (!producto) return res.status(404).json({ status: 'error', message: 'Producto no encontrado' });
        res.json({ status: 'success', data: producto });
    } catch (error) {
        res.status(500).json({ status: 'error', message: 'Error al obtener producto' });
    }
});

// POST /api/productos
router.post('/',
verificarToken,
upload.single('imagen'),

[
    body('codigo')
        .notEmpty().withMessage('El código es obligatorio')
        .isLength({ min: 2, max: 20 }).withMessage('Código inválido')
        .trim()
        .escape(),

    body('nombre')
        .notEmpty().withMessage('El nombre es obligatorio')
        .trim()
        .escape(),

    body('descripcion')
        .optional()
        .trim()
        .escape(),

    body('precio')
        .notEmpty().withMessage('El precio es obligatorio')
        .isFloat({ min: 0, max: 10000 }).withMessage('El precio debe ser numérico')
        .toFloat(),

    body('id_categoria')
        .notEmpty().withMessage('La categoría es obligatoria')
        .isInt().withMessage('La categoría debe ser numérica')
        .toInt()
],

validarCampos,
async (req, res) => {
    try {
        const { codigo, nombre, descripcion, precio, id_categoria } = req.body;
        const urlImagen = req.file ? `/img/productos/${req.file.filename}` : null;
        const id = await productosDB.insertar({
            codigo,
            nombre,
            descripcion,
            precio,
            id_categoria,
            urlImagen,
            fechaRegistro: new Date(),
            status: 1
        });
        res.status(201).json({ status: 'success', data: { id, mensaje: 'Producto agregado correctamente' } });
    } catch (error) {
        res.status(500).json({ status: 'error', message: 'Error al insertar producto' });
    }
});

// PUT /api/productos/:id
router.put('/:id',
verificarToken,
upload.single('imagen'),

[
    param('id')
        .isInt().withMessage('ID inválido')
        .toInt(),

    body('codigo')
        .notEmpty()
        .trim()
        .escape(),

    body('nombre')
        .notEmpty()
        .trim()
        .escape(),

    body('descripcion')
        .optional()
        .trim()
        .escape(),

    body('precio')
        .isFloat({ min: 0 })
        .toFloat(),

    body('id_categoria')
        .isInt()
        .toInt()
],

validarCampos,
async (req, res) => {
    try {
        const { codigo, nombre, descripcion, precio, id_categoria } = req.body;
        const datos = { codigo, nombre, descripcion, precio, id_categoria };
        if (req.file) datos.urlImagen = `/img/productos/${req.file.filename}`;
        await productosDB.actualizar(req.params.id, datos);
        res.json({ status: 'success', data: { mensaje: 'Producto actualizado correctamente' } });
    } catch (error) {
        res.status(500).json({ status: 'error', message: 'Error al actualizar producto' });
    }
});

// DELETE /api/productos/:id
router.delete('/:id',
verificarToken,
[
    param('id')
        .isInt().withMessage('ID inválido')
        .toInt()
],
validarCampos,
async (req, res) => {
    try {
        await productosDB.deshabilitar(req.params.id);
        res.json({ status: 'success', data: { mensaje: 'Producto deshabilitado correctamente' } });
    } catch (error) {
        res.status(500).json({ status: 'error', message: 'Error al deshabilitar producto' });
    }
});

// PUT /api/productos/:id/habilitar
router.put('/:id/habilitar', verificarToken, async (req, res) => {
    try {
        await productosDB.habilitar(req.params.id);
        res.json({ status: 'success', data: { mensaje: 'Producto habilitado correctamente' } });
    } catch (error) {
        res.status(500).json({ status: 'error', message: 'Error al habilitar producto' });
    }
});

// DELETE /api/productos/:id/eliminar
router.delete('/:id/eliminar', verificarToken, async (req, res) => {
    try {
        await productosDB.eliminar(req.params.id);
        res.json({ status: 'success', data: { mensaje: 'Producto eliminado correctamente' } });
    } catch (error) {
        res.status(500).json({ status: 'error', message: 'Error al eliminar producto' });
    }
});

export default router;
