import { body, validationResult } from 'express-validator';
import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import conexion from '../models/db.js';
import dotenv from 'dotenv';
dotenv.config();

const router = express.Router();

// POST /api/usuarios/login     Se agrego sanitizacion a login
router.post(
'/login',

[
    body('username')
        .trim()
        .escape()
        .isLength({ min: 3 })
        .withMessage('El usuario debe tener al menos 3 caracteres'),

    body('password')
        .trim()
        .isLength({ min: 6 })
        .withMessage('La contraseña debe tener al menos 6 caracteres')
],

async (req, res) => {
    try {

        const errores = validationResult(req);
        if (!errores.isEmpty()) {
            return res.status(400).json({ status: 'error', errores: errores.array() });
        }

        const { username, password } = req.body;

        conexion.query(
        'SELECT * FROM usuarios WHERE username = ? AND status = 1',
        [username],

        async (err, resultado) => {

            if (err) return res.status(500).json({ status: 'error', message: 'Error en el servidor' });

            if (resultado.length === 0)
                return res.status(401).json({ status: 'error', message: 'Credenciales invalidas' });

            const usuario = resultado[0];

            const passwordValida = await bcrypt.compare(password, usuario.password);

            if (!passwordValida)
                return res.status(401).json({ status: 'error', message: 'Contraseña incorrecta' });

            const token = jwt.sign(
                { id: usuario.id, username: usuario.username, roles: usuario.roles },
                process.env.JWT_SECRET,
                { expiresIn: '1h' }
            );

            const refreshToken = jwt.sign(
                { id: usuario.id },
                process.env.JWT_SECRET,
                { expiresIn: '7d' }
            );

            res.json({ status: 'success', data: { token, refreshToken, roles: usuario.roles } });

        });

    } catch (error) {
        res.status(500).json({ status: 'error', message: 'Error en el servidor' });
    }
});

// POST /api/usuarios/registro (solo para crear el admin inicial)
router.post(
'/registro',

[
    body('username')
        .trim()
        .escape()
        .notEmpty().withMessage('El usuario es obligatorio')
        .isLength({ min: 3 }),

    body('password')
        
        .notEmpty().withMessage('La contraseña es obligatoria')
        .isLength({ min: 6 }),

    body('roles')
        .trim()
        .escape()
        .isIn(['admin','empleado'])
        .withMessage('Rol no permitido')
],

async (req, res) => {

    try {

        const errores = validationResult(req);
        if (!errores.isEmpty()) {
            return res.status(400).json({ status: 'error', errores: errores.array() });
        }

        const { username, password, roles } = req.body;

        const passwordHash = await bcrypt.hash(password, 10);

conexion.query(
'SELECT id FROM usuarios WHERE username = ?',
[username],
(err, result) => {

    if (err)
        return res.status(500).json({ status: 'error', message: 'Error en el servidor' });

    if (result.length > 0) {
        return res.status(400).json({
            status:'error',
            message:'El usuario ya existe'
        });
    }

    conexion.query(
        'INSERT INTO usuarios (username, password, roles) VALUES (?, ?, ?)',
        [username, passwordHash, roles],
        (err, resultado) => {

            if (err)
                return res.status(500).json({ status: 'error', message: 'Error al registrar usuario' });

            res.status(201).json({
                status: 'success',
                data: { mensaje: 'Usuario registrado correctamente' }
            });
        }
    );

});

   
    } catch (error) {
        res.status(500).json({ status: 'error', message: 'Error en el servidor' });
    }

});

export default router;
