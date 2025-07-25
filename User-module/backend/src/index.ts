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
