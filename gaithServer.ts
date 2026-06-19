import "./src/config/config";

import express from "express";
import next from "next";
import cors from "cors";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import path from "path";

import { error } from "./src/middlewares/error";
import db from "./src/models";

import AuthRouter from "./src/routers/auth";
import EmployeesRouter from "./src/routers/employees";
import CustomersRouter from "./src/routers/customers";
import ServicesRouter from "./src/routers/services";
import ProjectsRouter from "./src/routers/projects";
import JobsRouter from "./src/routers/jobs";
import PropertiesRouter from "./src/routers/properties";
import InfoRouter from "./src/routers/info";
import FeaturesRouter from "./src/routers/features";
import HeroRouter from "./src/routers/hero";
import AboutRouter from "./src/routers/about";

const port = process.env.PORT || 5000;

const dev = process.env.NODE_ENV !== "production";

const nextApp = next({
  dev,
  dir: path.resolve(__dirname, "./client"),
});

const handle = nextApp.getRequestHandler();

nextApp.prepare().then(async () => {
  const app = express();

  app.use(
    cors({
      origin: [process.env.FRONTEND_URL!],
      methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
      credentials: true,
    })
  );

  app.use(cookieParser());

  app.use(express.json());

  app.use(bodyParser.urlencoded({ extended: true }));

  app.use((req, _res, next) => {
    if (req.path === "/index.php") {
      req.url = req.url.replace(/^\/index\.php/, "/");
    }

    next();
  });

  app.use(
    "/uploads",
    express.static(path.join(process.cwd(), "uploads"))
  );

  // API Routes
  app.use("/api/v0/auth", AuthRouter);
  app.use("/api/v0/employees", EmployeesRouter);
  app.use("/api/v0/customers", CustomersRouter);
  app.use("/api/v0/services", ServicesRouter);
  app.use("/api/v0/projects", ProjectsRouter);
  app.use("/api/v0/jobs", JobsRouter);
  app.use("/api/v0/info", InfoRouter);
  app.use("/api/v0/features", FeaturesRouter);
  app.use("/api/v0/properties", PropertiesRouter);
  app.use("/api/v0/hero", HeroRouter);
  app.use("/api/v0/about", AboutRouter);

  // Next.js handler
  app.all(/.*/, (req, res) => {
    return handle(req, res);
  });

  app.use(error);

  try {
    await db.sequelize?.sync();

    app.listen(Number(port), () => {
      console.log(`Server is running on port ${port}`);
    });
  } catch (err) {
    console.error("Failed to start server:", err);
    process.exit(1);
  }
});