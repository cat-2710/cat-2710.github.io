import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();



export function verificarToken(req, res, next) {
    const token = req.headers['authorization']?.split(' ')[1];
    if (!token) return res.status(401).json({ status: 'error', message: 'Token requerido' });

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.usuario = decoded;
        next();
    } catch (error) {
        res.status(401).json({ status: 'error', message: 'Token inválido o expirado' });
    }
}
