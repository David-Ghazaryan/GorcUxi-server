import dotenv from "dotenv";
dotenv.config();
import express, { json, urlencoded } from "express";
import sequelize from "./db.js";
import cors from "cors";
import bodyParser from "body-parser";
import AuthRoutes from "./src/routes/auth.js";
import ReviewRoutes from "./src/routes/review.js";
import PricingRoutes from "./src/routes/pricing.js";
import errorHandler from "./src/middlewares/error-handler.js";

const app = express();

app.use(bodyParser.json({ limit: "1mb" }));

app.use(json({ limit: "1mb" }));
app.use(urlencoded({ limit: "1mb", extended: true }));
app.use(cors({}));

app.use("/api/auth", AuthRoutes);
app.use("/api/review", ReviewRoutes);
app.use("/api/pricing", PricingRoutes);

app.use(errorHandler);

const start = async () => {
  try {
    await sequelize.authenticate();
    await sequelize.sync({ alter: true });
    app.listen(process.env.PORT || 8080, () =>
      console.log("Server OK", process.env.PORT)
    );
  } catch (e) {
    console.log(e);
  }
};

start();
