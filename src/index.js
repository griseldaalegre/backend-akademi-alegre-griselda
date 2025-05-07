const express = require("express");
require("./db/mongoose"); 
const patientsRouter = require("./routes/patients-routes");
const usersRouter = require("./routes/users-routes");
const doctorsRouter = require("./routes/doctors-routes");
const appointmentsRouter = require("./routes/appointments-routes");

const app = express(); 
const port = process.env.PORT || 3000; 

app.use(express.json()); 

app.use('/patients',patientsRouter);
app.use('/users', usersRouter);
app.use('/doctors',doctorsRouter);
app.use('/appointments',appointmentsRouter);

app.listen(port, () => {
  console.log("Server is up on port " + port); 
});
