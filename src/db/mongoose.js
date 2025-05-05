const mongoose = require("mongoose");

mongoose
  .connect(
    "mongodb+srv://gri:pzX64SVX7Zcxlqkx@cluster0.r2pfe5f.mongodb.net/proyecto_backend_akademi?retryWrites=true&w=majority&appName=Cluster0"
  )
  .then(() => {
    console.log("Conectado a MongoDB Atlas");
  })
  .catch((error) => {
    console.error("Error al conectar a MongoDB:", error);
  });
