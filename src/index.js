const express = require("express");
require("./db/mongoose");
const patientsRouter = require("./routes/patients-routes");
const usersRouter = require("./routes/users-routes");
const doctorsRouter = require("./routes/doctors-routes");
const appointmentsRouter = require("./routes/appointments-routes");
const errorHandler = require("./middleware/error-handler");

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use("/users", usersRouter);
app.use("/patients", patientsRouter);
app.use("/doctors", doctorsRouter);
app.use("/appointments", appointmentsRouter);
app.get("/test-error", (req, res, next) => {
  const error = new Error("Este es un error de prueba");
  error.code = 418; // Código HTTP teapot solo para distinguirlo
  next(error);
});

app.use(errorHandler);

app.listen(port, () => {
  console.log("Server is up on port " + port);
});
