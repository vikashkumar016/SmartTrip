import express from "express";
import cors from "cors";
import helmet from "helmet";

import authRoutes
  from "./routes/authRoutes.js";

import tripRoutes
  from "./routes/tripRoutes.js";

import requestLogger
  from "./middleware/requestLogger.js";

import {
  notFound,
  errorHandler,
} from "./middleware/errorMiddleware.js";

import {
  corsOptions,
} from "./config/cors.js";


const app = express();


const isProduction =
  process.env.NODE_ENV ===
  "production";


// =================================
// HIDE EXPRESS INFORMATION
// =================================

app.disable(
  "x-powered-by"
);


// =================================
// SECURITY HEADERS
// =================================

app.use(
  helmet(
    isProduction
      ? {}
      : {
          strictTransportSecurity:
            false,

          contentSecurityPolicy: {
            directives: {
              upgradeInsecureRequests:
                null,
            },
          },
        }
  )
);


// =================================
// CORS
// =================================

app.use(
  cors(corsOptions)
);


// =================================
// BODY PARSER
// =================================

app.use(
  express.json({
    limit: "20kb",
  })
);


// =================================
// LOGGING
// =================================

app.use(
  requestLogger
);


// =================================
// HEALTH
// =================================

app.get(
  "/api/health",
  (req, res) => {

    res.status(200).json({
      success: true,
      message:
        "SmartTrip AI backend is healthy",
    });
  }
);


// =================================
// ROUTES
// =================================

app.use(
  "/api/auth",
  authRoutes
);


app.use(
  "/api/trips",
  tripRoutes
);


// =================================
// NOT FOUND
// =================================

app.use(
  notFound
);


// =================================
// GLOBAL ERROR HANDLER
// MUST BE LAST
// =================================

app.use(
  errorHandler
);


export default app;