const mongoose = require("mongoose"); 

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
