const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const permit = require("../middleware/roles");
const usersController = require("../controllers/user-controller");
const { userValidator, loginValidator, passwordValidator } = require("../validators/user-validator");


// crear usuario
router.post("/", auth, userValidator, permit("admin"), usersController.createUser);

// login
router.post("/login", loginValidator, usersController.login);
// editar usuario
router.patch("/:id", auth, permit("admin"), usersController.updateUser);

// eliminar usuario
router.delete("/:id", auth, permit("admin"), usersController.deleteUser);

// listar usuarios
router.get("/", auth, permit("admin"), usersController.getUsers);

// recuperar contraseña
router.post("/:id/recover-password", auth, permit("admin"), usersController.recoverPassword);

// resetear contraseña
router.post("/reset-password",passwordValidator, usersController.resetPassword);

module.exports = router;
