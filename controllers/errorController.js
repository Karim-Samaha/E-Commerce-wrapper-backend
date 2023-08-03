const AppError = require("../utilities/appError");

const sendErrDev = (err, req, res) => {
  res.status(err.statusCode).end(
    JSON.stringify({
      status: err.status,
      message: err.message,
      stack: err.stack,
      // error: err,
    })
  );
};
const errorHandler = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";
  err.message = err.message || "internal server error";
  err.isOpertional = true;
  sendErrDev(err, req, res);
};

module.exports = errorHandler;
