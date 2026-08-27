import { randomUUID } from "crypto";

const requestLogger = (
  req,
  res,
  next
) => {
  // Unique ID for this request
  const requestId =
    req.headers["x-request-id"] ||
    randomUUID();

  req.requestId = requestId;

  // Return ID to client too
  res.setHeader(
    "X-Request-ID",
    requestId
  );

  const startTime =
    process.hrtime.bigint();

  /*
    finish event fires when
    response has been sent.
  */
  res.on("finish", () => {
    const endTime =
      process.hrtime.bigint();

    const durationMs =
      Number(
        endTime - startTime
      ) / 1_000_000;

    const userId =
      req.user?._id?.toString() ||
      "anonymous";

    const log = {
      requestId,

      method:
        req.method,

      path:
        req.originalUrl,

      status:
        res.statusCode,

      responseTimeMs:
        Number(
          durationMs.toFixed(2)
        ),

      userId,

      timestamp:
        new Date().toISOString(),
    };

    if (res.statusCode >= 500) {
      console.error(
        "[API ERROR]",
        log
      );
    } else if (
      res.statusCode >= 400
    ) {
      console.warn(
        "[API WARN]",
        log
      );
    } else {
      console.log(
        "[API]",
        log
      );
    }
  });

  next();
};

export default requestLogger;