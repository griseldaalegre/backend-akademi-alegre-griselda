const mongoose = require("mongoose");
const validator = require("validator"); 
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
require("dotenv").config({ path: "config/dev.env" }); 

//defino un esquema: estructura y validaciones del documento en MongoDB.
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      unique: true,
      required: true,
      trim: true,
      lowercase: true,
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error("Email invalido");
        }
      },
    },
    password: {
      type: String,
      required: true,
      minlength: 7,
      trim: true,
      validate(value) {
        if (value.toLowerCase().includes("password")) {
          throw new Error('La contraseña no puede contener "password".');
        }
      },
    },
    rol: { type: String, enum: ["admin", "reception"], required: true },
    activo: { type: Boolean, default: true },
    tokens: [
      {
        token: {
          type: String,
          required: true,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

//genero token
userSchema.methods.generateAuthToken = async function () {
  const user = this;

  //la firma se genera header/datos/clavesecreta - se calcula un hash seguro que es la firma.

  const token = jwt.sign({ _id: user._id.toString() }, process.env.JWT_SECRET);

  user.tokens = user.tokens.concat({ token });
  await user.save();
  return token;
};

userSchema.statics.findByCredentials = async (email, password) => {
  const user = await User.findOne({ email });
  if (!user) {
    throw new Error("No se pudo locguear, no encontro usuario");
  }

  // comparo la contraseña con la hasheada
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new Error("Las contraseñas no coinciden");
  }
  return user;
};

userSchema.pre("save", async function (next) {
  const user = this;

  if (user.isModified("password")) {
    user.password = await bcrypt.hash(user.password, 8);
  }

  next();
});

userSchema.pre("remove", async function (next) {
  const user = this;
  console.log(`Eliminando usuario con ID: ${user._id}`);
  next();
});

const User = mongoose.model("User", userSchema);

module.exports = User;


