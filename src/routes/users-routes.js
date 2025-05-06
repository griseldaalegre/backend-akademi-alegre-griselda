const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const permit = require("../middleware/roles");
const usersController = require("../controllers/user-controller");

// crear usuario
router.post("/users", auth, permit("admin"), usersController.createUser);

// login
router.post("/users/login", usersController.login);

// editar usuario
router.patch("/users/:id", auth, permit("admin"), usersController.updateUser);

// eliminar usuario
router.delete("/users/:id", auth, permit("admin"), usersController.deleteUser);

// listar usuarios
router.get("/users", auth, permit("admin"), usersController.getUsers);

// recuperar contraseña
router.post("/users/:id/recover-password", auth, permit("admin"), usersController.recoverPassword);

// resetear contraseña
router.post("/users/reset-password", usersController.resetPassword);

module.exports = router;
