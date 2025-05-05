module.exports = function permit(...allowedRoles) {
  return (req, res, next) => {
    if (!req.user || !allowedRoles.includes(req.user.rol)) {
      return res.status(403).send({ error: "Acceso denegado" });
    }
    next();
  };
};
