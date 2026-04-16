const { body } = require("express-validator");

exports.validarUsuario = [
  body("nombre")
    .trim()
    .escape()
    .isLength({ min: 3 })
    .withMessage("El nombre debe tener al menos 3 caracteres"),

  body("email")
    .isEmail()
    .normalizeEmail()
    .withMessage("Correo inválido"),

  body("password")
    .trim()
    .isLength({ min: 6 })
    .withMessage("La contraseña debe tener al menos 6 caracteres")
];

exports.validarProducto = [
  body("nombre")
    .trim()
    .escape(),

  body("precio")
    .isFloat({ min: 0 })
];
