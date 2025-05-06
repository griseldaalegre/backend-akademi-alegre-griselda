const express = require("express");
require("./db/mongoose"); 
const patientsRouter = require("./routes/patients-routes");
const userRouter = require("./routes/users-routes");

const app = express(); 
const port = process.env.PORT || 3000; 

app.use(express.json()); 

app.use(patientsRouter);
app.use(userRouter);

app.listen(port, () => {
  console.log("Server is up on port " + port); 
});
