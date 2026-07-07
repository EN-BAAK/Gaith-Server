import "./src/config/config";

import express from "express";
// import next from "next";
import cors from "cors";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import path from "path";
import { error } from "./src/middlewares/error";
import db from "./src/models";
import UserRouter from "./src/routers/users";
import SizesRouter from "./src/routers/sizes";
import ColorsRouter from "./src/routers/colors";
import ProductsRouter from "./src/routers/products";
import BranchesRouter from "./src/routers/branch";
import GroupBranchesRouter from "./src/routers/groupBranch";
import OrdersRouter from "./src/routers/orders";
import CategoriesRouter from "./src/routers/categories";
import BrandsRouter from "./src/routers/brands";
import DashboardRouter from "./src/routers/dashboard";
import ContactRouter from "./src/routers/contact";

const port = process.env.PORT || 5000;

// const dev = process.env.NODE_ENV !== "production";

// const nextApp = next({
//   dev,
//   dir: path.resolve(__dirname, "./client"),
// });

// const handle = nextApp.getRequestHandler();

// nextApp.prepare().then(async () => {
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

app.use("/api/v0/auth", UserRouter);
app.use("/api/v0/sizes", SizesRouter);
app.use("/api/v0/colors", ColorsRouter);
app.use("/api/v0/products", ProductsRouter);
app.use("/api/v0/branches", BranchesRouter);
app.use("/api/v0/brands", BrandsRouter);
app.use("/api/v0/group-branches", GroupBranchesRouter);
app.use("/api/v0/orders", OrdersRouter);
app.use("/api/v0/categories", CategoriesRouter);
app.use("/api/v0/dashboard", DashboardRouter);
app.use("/api/v0/contact", ContactRouter);

// Next.js handler
// app.all(/.*/, (req, res) => {
//   return handle(req, res);
// });

app.use(error);

try {
  // await db.sequelize?.sync();
  // 
  db.sequelize?.sync().then(() => {
    app.listen(Number(port), () => {
      console.log(`Server is running on port ${port}`);
    });
  })
} catch (err) {
  console.error("Failed to start server:", err);
  process.exit(1);
}
// });