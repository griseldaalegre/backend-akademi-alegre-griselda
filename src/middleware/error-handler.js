const errorHandler = (error, req, res, next) => {
    if (res.headersSent) {
      return next(error);
    }
  
    res.status(error.code || 500).json({
      message: error.message || "Error interno del servidor.",
    });
  };
  
  module.exports = errorHandler;
  