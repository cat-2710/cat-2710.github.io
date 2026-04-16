import mysql from 'mysql2';
import dotenv from 'dotenv';
dotenv.config();

const conexion = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

conexion.connect((err) => {
    if (err) {
        console.log('Error al conectar a la BD: ' + err);
    } else {
        console.log('Conexión a la BD exitosa');
    }
});
    
export default conexion;
