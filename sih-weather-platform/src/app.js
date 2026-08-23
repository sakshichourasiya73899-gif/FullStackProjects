import express from "express";
import helmet from "helmet";
import cors from "cors";
import morgan from "morgan";
import { notFound, errorHandler } from "./middlewares/errorHandler.js";


const app = express();
console.log("Express app initialized");



app.use(helmet());
app.use(
  cors({
    origin: process.env.CORS_ORIGIN?.split(",") || "*",
    credentials: true,
  })
);
app.use(morgan("dev"));
app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: true, limit: "10kb" }));

app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok" });
});
app.use(notFound);
app.use(errorHandler);




export default app;