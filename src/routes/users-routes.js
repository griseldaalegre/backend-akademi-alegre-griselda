const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const permit = require("../middleware/roles");
const usersController = require("../controllers/user-controller");
const { createUserValidator, loginValidator, passwordValidator, updateUserValidator } = require("../validators/user-validator");

router.post("/", auth, permit("admin"), createUserValidator, usersController.createUser);

router.post("/login", loginValidator, usersController.login);

router.patch("/:id", auth, permit("admin"),updateUserValidator, usersController.updateUser);

router.delete("/:id", auth, permit("admin"), usersController.deleteUser);

router.get("/", auth, permit("admin"), usersController.getUsers);

router.post("/recover-password", auth, permit("admin"), usersController.recoverPassword);


router.post("/reset-password",passwordValidator, usersController.resetPassword);

module.exports = router;
