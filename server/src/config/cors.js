import ApiError
  from "../utils/ApiError.js";


const allowedOrigins = [
  process.env.CLIENT_URL,
].filter(Boolean);


export const corsOptions = {

  origin: (
    origin,
    callback
  ) => {

    /*
      No Origin header:
      Postman, curl, server-to-server,
      tests etc.
    */

    if (!origin) {
      return callback(
        null,
        true
      );
    }


    if (
      allowedOrigins.includes(
        origin
      )
    ) {
      return callback(
        null,
        true
      );
    }


    return callback(
      new ApiError(
        403,
        "Origin not allowed by CORS"
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
};