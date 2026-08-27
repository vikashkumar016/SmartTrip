import "dotenv/config";

import app from "./app.js";

import connectDB
  from "./config/db.js";

import {
  connectRedis,
} from "./config/redis.js";

import {
  validateEnv,
} from "./config/env.js";


const startServer = async () => {

  try {

    const env =
      validateEnv();


    await connectDB();

    await connectRedis();


    app.listen(
      env.PORT,
      "0.0.0.0",
      () => {

        console.log(
          `Server running on port ${env.PORT}`
        );

      }
    );

  } catch (error) {

    console.error(
      "Server startup failed:",
      error.message
    );

    process.exit(1);
  }
};


startServer();