const mongoose = require("mongoose");
require("dotenv").config({ path: "config/dev.env" }); // Carga las variables de entorno

mongoose
  .connect(
    process.env.MONGODB_URL
  )
  .then(() => {
    console.log("Conectado a MongoDB Atlas");
  })
  .catch((error) => {
    console.error("Error al conectar a MongoDB:", error);
  });
