import dotenv from "dotenv";
import connectDB from "./src/common/db/connection.js";
import express from "express";
import cors from "cors";
// import cookieParser from "cookie-parser";
import morgan from "morgan";
import logger from "./src/common/utils/logger.js";
import { errorHandler } from "./src/middlewares/errorMiddlewares.js";
import authRouter from "./src/routes/authRoutes.js";

dotenv.config({ path: "./.env" });
const app = express();
const port = process.env.PORT || 3000;
const isProd = process.env.NODE_ENV === "production";

// HTTP logs (dev only)
if (!isProd) {
  app.use(
    morgan(":method :url :status :res[content-length] - :response-time ms", {
      stream: {
        write: (message) => logger.http(message.trim()),
      },
    })
  );
}

const allowedOrigins = process.env.CORS_ORIGIN?.split(",") || [];
app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (like curl or Postman)
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      } else {
        console.warn("❌ Blocked by CORS:", origin);
        return callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
// app.use(cookieParser());

// routers here
app.get("/api/v1/health", (req, res) => res.status(200).send("ok"));
app.use("/api/v1/auth", authRouter);

// -------------------------------TO BE REMOVED----------------------------------
import axios from "axios";
import cron from "node-cron";
import ServerError from "./src/common/errors/ServerError.js";

process.on("uncaughtException", (err) =>
  logger.error("Uncaught Exception:", err)
);
process.on("unhandledRejection", (err) =>
  logger.error("Unhandled Rejection:", err)
);
cron.schedule("*/5 * * * *", async () => {
  const tick = new Date().toISOString();
  logger.http(`Cron job fired at ${tick}`);

  try {
    const { data, status } = await axios.get("http://www.google.com", {
      timeout: 5000, // abort if >5s
    });

    if (status === 200) {
      logger.info(`✅ Cron success, payload size: ${data.length}`);
    } else {
      logger.warn(`⚠️ Cron non-200 status: ${status}`);
    }
  } catch (err) {
    // network/timeouts/socket errors end up here
    logger.error("🚨 Cron HTTP error:", err.message);
    throw new ServerError(502, err.message);
  }
});
// -------------------------------ENDS----------------------------------

app.use(errorHandler);

connectDB()
  .then(() => {
    app.on("error", (error) => {
      console.log("Error => ", error);
      throw error;
    });
    app.listen(port, () => {
      console.log(`Server is running on port => ${port}`);
    });
  })
  .catch((error) => {
    console.log("DB connection failed => ", error);
  });
