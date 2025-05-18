import dotenv from "dotenv";
import nunjucks from "nunjucks";
dotenv.config();

import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import connectToDb from "./db/db.js";
import userRouter from "./routes/user.routes.js";

const PORT = process.env.PORT || 8000;

const app = express();
app.set("view engine", "html");
app.use("/static", express.static("static"));

const env = nunjucks.configure("views", {
  express: app,
  autoescape: true,
  watch: true, // This is the key option - watches for template changes
  noCache: true, // Disable caching in development
});

env.addFilter("toIST", (utcTimeStr) => {
  const date = new Date(utcTimeStr);
  return date.toLocaleString("en-IN", {
    timeZone: "Asia/Kolkata",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
});
app.use(cors());
app.use(express.json());
app.use(cookieParser());

// connecting to local mongodb database
connectToDb();

app.use("/users", userRouter);
app.get("/", (req, res) => {
  res.render("home");
});

app.listen(PORT, () => {
  console.log(`listening to port ${PORT}`);
});
