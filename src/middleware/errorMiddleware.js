import { format } from "date-fns";
import { ResponseError } from "../error/responseError.js";
import { logEvents } from "../middleware/logger.js";
import { ZodError } from "zod";

const currDate = `${format(new Date(), "yyyyMMdd")}`.toString();

const errorMiddleware = async (err, req, res, next) => {
  if (!err) {
    next();
    return;
  }

  if (err instanceof ZodError) {
    logEvents(`${err.message}`, `${currDate}_errApiLog.log`);
    res
      .status(400)
      .json({
        errors: `Validatio Error: ${JSON.stringify(err)}`,
      })
      .end();
  } else if (err instanceof ResponseError) {
    logEvents(`${err.message}`, `${currDate}_errApiLog.log`);
    res
      .status(err.status)
      .json({
        errors: err.message,
      })
      .end();
  } else {
    logEvents(`${err.message}`, `${currDate}_errLog.log`);
    res
      .status(500)
      .json({
        errors: err.message,
      })
      .end();
  }
};

export { errorMiddleware };
