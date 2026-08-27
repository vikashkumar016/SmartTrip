import ApiError from "../utils/ApiError.js";


const formatZodErrors = (issues) => {
  return issues.map((issue) => ({
    field:
      issue.path.join(".") ||
      "request",

    message:
      issue.message,
  }));
};


// ===============================
// BODY VALIDATION
// ===============================

export const validateBody =
  (schema) => {
    return (req, res, next) => {
      const result =
        schema.safeParse(
          req.body
        );

      if (!result.success) {
        return next(
          new ApiError(
            400,
            "Validation failed",
            formatZodErrors(
              result.error.issues
            )
          )
        );
      }

      /*
        Replace original input with
        validated + transformed data.
      */

      req.body =
        result.data;

      next();
    };
  };



// ===============================
// PARAM VALIDATION
// ===============================

export const validateParams =
  (schema) => {
    return (req, res, next) => {
      const result =
        schema.safeParse(
          req.params
        );

      if (!result.success) {
        return next(
          new ApiError(
            400,
            "Validation failed",
            formatZodErrors(
              result.error.issues
            )
          )
        );
      }

      next();
    };
  };