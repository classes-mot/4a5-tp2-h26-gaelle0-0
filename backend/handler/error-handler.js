const errorHandler = (error, req, res, next) => {
  if (res.headerSent) {
    return next(error);
  }

  res.status(error.code || 500).json({
    message: error.message || "Une erreur inconnue est survenue",
  });
};

export default errorHandler;
