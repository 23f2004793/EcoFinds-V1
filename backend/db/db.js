import mongoose from "mongoose";

export default function connectToDb() {
  mongoose
    .connect(process.env.DB_CONNECT)
    .then(() => {
      console.log("connected to mongodb");
    })
    .catch((e) => {
      console.log("error connecting mongodb\n" + e);
    });
}
