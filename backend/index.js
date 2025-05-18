import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import connectToDb from "./db/db.js";

const PORT = process.env.PORT || 8000;

const app = express();
app.use(cors());
app.use(express.json());
app.use(cookieParser());

// connecting to local mongodb database
connectToDb();

app.listen(PORT, () => {
  console.log(`listening to port ${PORT}`);
});
