import "./otel-init";
import "reflect-metadata";
import express from "express";
import cors from "cors";
import morgan from "morgan";
import dotenv from "dotenv";
import { AppDataSource } from "./config/database";
import { userRouter } from "./routes/userRoutes";
import { errorHandler } from "./middleware/errorHandler";
import swaggerUi from "swagger-ui-express";
// eslint-disable-next-line @typescript-eslint/no-var-requires
const swaggerDocument = require("../swagger.json");
import { authRouter } from "./routes/authRoutes";
import { loginRateLimiter } from "./middleware/rateLimiter";
import { authenticateJWT } from "./middleware/authMiddleware";
import { requireRole } from "./middleware/rbacMiddleware";

// ...

dotenv.config();

const app = express();

// Metrics
import { metricsHandler, httpRequestCounter } from './metrics';
app.get('/metrics', metricsHandler);

// Increment Prometheus counter for every request
app.use((req, res, next) => {
  res.on('finish', () => {
    httpRequestCounter.inc({
      method: req.method,
      route: req.route ? req.route.path : req.path,
      status: res.statusCode,
    });
  });
  next();
});

app.use(cors());
app.use(morgan("dev"));
app.use(express.json());

app.use("/api/v1/auth/login", loginRateLimiter); // rate limit login
app.use("/api/v1/auth", authRouter);

app.use("/api/v1/users", authenticateJWT, requireRole(["admin", "user"]), userRouter);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use(errorHandler);

const PORT = process.env.PORT || 3000;

AppDataSource.initialize()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Database connection error:", err);
    process.exit(1);
  });
