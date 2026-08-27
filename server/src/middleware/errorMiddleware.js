import ApiError from "../utils/ApiError.js";

export const notFound = (
  req,
  res,
  next
) => {
  next(
    new ApiError(
      404,
      `Route not found: ${req.originalUrl}`
    )
  );
};


export const errorHandler = (
  err,
  req,
  res,
  next
) => {
  let statusCode =
  err.statusCode ||
  err.status ||
  500;
  if (
  err.type ===
  "entity.too.large"
) {
  statusCode = 413;

  message =
    "Request body is too large";
}

  let message =
    err.message ||
    "Internal Server Error";

  // =========================
  // Invalid MongoDB ObjectId
  // =========================

  if (err.name === "CastError") {
    statusCode = 400;
    message = "Invalid resource ID";
  }

  // =========================
  // Mongoose validation
  // =========================

  if (
    err.name === "ValidationError"
  ) {
    statusCode = 400;

    message = Object.values(
      err.errors
    )
      .map(
        (error) =>
          error.message
      )
      .join(", ");
  }

  // =========================
  // Duplicate MongoDB value
  // =========================

  if (err.code === 11000) {
    statusCode = 409;

    const field = Object.keys(
      err.keyValue || {}
    )[0];

    message = field
      ? `${field} already exists`
      : "Duplicate value";
  }

  // =========================
  // Server logging
  // =========================

  console.error(
  "[SERVER ERROR]",
  {
    requestId:
      req.requestId,

    method:
      req.method,

    path:
      req.originalUrl,

    status:
      statusCode,

    message:
      err.message,

    stack:
      err.stack,
  }
);

  // =========================
  // Response
  // =========================

res.status(statusCode).json({
  success: false,

  message,

  requestId:
    req.requestId,

  ...(err.details && {
    details: err.details,
  }),

  ...(process.env.NODE_ENV !==
    "production" && {
    stack: err.stack,
  }),  
});
};