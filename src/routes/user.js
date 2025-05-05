const express = require('express'); 
const router = new express.Router();
const User = require("../models/User");
const auth = require("../middleware/auth.js");
const permit = require('../middleware/roles');
const usersController = require('../controllers/user-controller');

//creo un usuario
router.post("/users", async (req, res) => {
  const user = new User(req.body);// // creo una instancia con los datos q recibo en el body

  try {
    await user.save();
    const token = await user.generateAuthToken();
    res.status(201).send({user, token});
  } catch (e) {
    console.error(e); 
    res.status(400).send(e);
  }
});

//login
router.post("/users/login", async (req, res) => {
  try {
    const user = await User.findByCredentials(
      req.body.email,
      req.body.password
    );
    const token = await user.generateAuthToken();
    res.send({ user, token }); 
  } catch (e) {
    console.log(e);
    res.status(400).send(e);
  }
});

//logout
router.post("/users/logout", auth, async (req, res) => {
  try {
    req.user.tokens = req.user.tokens.filter(
      (token) => token.token !== req.token
    );
    await req.user.save();
    res.send({ message: "Sesión cerrada con éxito" });
  } catch (error) {
    res.status(500).send({ error: "Error al cerrar sesión" });
  }
});

//edit
router.patch("/users/:id", auth, permit('admin'), async (req, res) => {
  const updates = Object.keys(req.body);
  const allowedUpdates = ["name", "email", "password", "rol", "activo"];
  const isValidOperation = updates.every((update) =>
    allowedUpdates.includes(update)
  );

  if (!isValidOperation) {
    return res.status(400).send({ error: "Actualización inválida" });
  }

  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).send({ error: "Usuario no encontrado" });
    }

    updates.forEach((update) => {
      user[update] = req.body[update];
    });

    await user.save();
    res.send(user);
  } catch (e) {
    console.error(e);
    res.status(400).send({ error: "No se pudo actualizar el usuario" });
  }
});

router.delete("/users/:id", auth, async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).send({ error: "Usuario no encontrado" });
    }
    res.send(user);
  } catch (e) {
    res.status(500).send();
  }
})

//listar usuarios
router.get('/users', auth, permit('admin'), usersController.getUsers);

module.exports = router; 
