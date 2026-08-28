import ApiError from "../utils/ApiError.js";

const allowedOrigins = [
  process.env.CLIENT_URL,

  // Local React development
  ...(process.env.NODE_ENV !== "production"
    ? ["http://localhost:5173"]
    : []),
].filter(Boolean);


export const corsOptions = {
  origin: (origin, callback) => {

    console.log(
      "Request Origin:",
      origin
    );

    console.log(
      "Allowed Origins:",
      allowedOrigins
    );


    // Postman, curl, server-to-server
    if (!origin) {
      return callback(
        null,
        true
      );
    }


    if (
      allowedOrigins.includes(origin)
    ) {
      return callback(
        null,
        true
      );
    }


    console.warn(
      "CORS blocked origin:",
      origin
    );


    return callback(
      new ApiError(
        403,
        `Origin not allowed by CORS: ${origin}`
      )
    );
  },


  methods: [
    "GET",
    "POST",
    "PATCH",
    "DELETE",
    "OPTIONS",
  ],


  allowedHeaders: [
    "Content-Type",
    "Authorization",
    "X-Request-ID",
  ],


  exposedHeaders: [
    "X-Request-ID",
    "X-Cache",
    "X-RateLimit-Limit",
    "X-RateLimit-Remaining",
    "X-RateLimit-Reset",
  ],


  credentials: false,


  // Successful preflight
  optionsSuccessStatus: 204,
};