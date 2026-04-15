import express from 'express';
import categoriasDB from '../models/categorias.js';
import { verificarToken } from './authMiddleware.js';

const router = express.Router();


// GET /api/categorias
router.get('/', async (req, res) => {
    try {
        const categorias = await categoriasDB.obtenerTodas();
        res.json({ status: 'success', data: categorias });
    } catch (error) {
        res.status(500).json({ status: 'error', message: 'Error obtener categorias' });
    }
});

// GET /api/categorias/:id
router.get('/:id', async (req, res) => {
    try {
        const categoria = await categoriasDB.obtenerPorId(req.params.id);
        if (!categoria) return res.status(404).json({ status: 'error', message: 'Categoria no encontrada' });
        res.json({ status: 'success', data: categoria });
    } catch (error) {
        res.status(500).json({ status: 'error', message: 'Error obtener categoria' });
    }
});

// POST /api/categorias
router.post('/', verificarToken, async (req, res) => {
    try {
        const { codigo, nombre } = req.body;
        if (!codigo || !nombre) return res.status(400).json({ status: 'error', message: 'codigo y nombre son obligatorios' });
        const id = await categoriasDB.insertar({
            codigo,
            nombre,
            fechaRegistro: new Date(),
            status: 1
        });
        res.status(201).json({ status: 'success', data: { id, mensaje: 'Categoria agregada correctamente' } });
    } catch (error) {
        res.status(500).json({ status: 'error', message: 'Error al insertar categoría' });
    }
});

// DELETE /api/categorias/:id/eliminar
router.delete('/:id/eliminar', verificarToken, async (req, res) => {
    try {
        await categoriasDB.eliminar(req.params.id);
        res.json({ status: 'success', data: { mensaje: 'Categoría eliminada correctamente' } });
    } catch (error) {
        res.status(500).json({ status: 'error', message: 'Error al eliminar categoría' });
    }
});

// PUT /api/categorias/:id/habilitar
router.put('/:id/habilitar', verificarToken, async (req, res) => {
    try {
        await categoriasDB.habilitar(req.params.id);
        res.json({ status: 'success', data: { mensaje: 'Categoría habilitada correctamente' } });
    } catch (error) {
        res.status(500).json({ status: 'error', message: 'Error al habilitar categoría' });
    }
});

// PUT /api/categorias/:id
router.put('/:id', verificarToken, async (req, res) => {
    try {
        const { codigo, nombre } = req.body;
        if (!codigo || !nombre) return res.status(400).json({ status: 'error', message: 'Código y nombre son obligatorios' });
        await categoriasDB.actualizar(req.params.id, { codigo, nombre });
        res.json({ status: 'success', data: { mensaje: 'Categoria actualizada correctamente' } });
    } catch (error) {
        res.status(500).json({ status: 'error', message: 'Error al actualizar categoría' });
    }
});

// DELETE /api/categorias/:id
router.delete('/:id', verificarToken, async (req, res) => {
    try {
        await categoriasDB.deshabilitar(req.params.id);
        res.json({ status: 'success', data: { mensaje: 'Categoría deshabilitada correctamente' } });
    } catch (error) {
        res.status(500).json({ status: 'error', message: 'error deshabilitar categoria' });
    }
});

export default router;
