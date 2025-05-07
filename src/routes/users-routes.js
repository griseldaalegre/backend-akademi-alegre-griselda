const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const permit = require("../middleware/roles");
const usersController = require("../controllers/user-controller");

// crear usuario
router.post("/", auth, permit("admin"), usersController.createUser);

// login
router.post("/login", usersController.login);

// editar usuario
router.patch("/:id", auth, permit("admin"), usersController.updateUser);

// eliminar usuario
router.delete("/:id", auth, permit("admin"), usersController.deleteUser);

// listar usuarios
router.get("/", auth, permit("admin"), usersController.getUsers);

// recuperar contraseña
router.post("/:id/recover-password", auth, permit("admin"), usersController.recoverPassword);

// resetear contraseña
router.post("/reset-password", usersController.resetPassword);

module.exports = router;
