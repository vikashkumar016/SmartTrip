import ApiError from "../utils/ApiError.js";

const allowedOrigins = [
  process.env.CLIENT_URL?.trim(),

  ...(process.env.NODE_ENV !== "production"
    ? ["http://localhost:5173"]
    : []),
].filter(Boolean);


export const corsOptions = {
  origin: (origin, callback) => {
    console.log(
      "Request Origin:",
      JSON.stringify(origin)
    );

    console.log(
      "Allowed Origins:",
      allowedOrigins.map(
        (item) => JSON.stringify(item)
      )
    );


    if (!origin) {
      return callback(
        null,
        true
      );
    }


    if (
      allowedOrigins.includes(
        origin.trim()
      )
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

  optionsSuccessStatus: 204,
};