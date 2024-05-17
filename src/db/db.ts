import mongoose from "mongoose";
const dbName = "ssl";
// const dbUrl = "mongodb://localhost:27017/ssl";

export const db = mongoose
   .connect("mongodb://127.0.0.1:27017/ssl")
   .then(() => console.log(`Connected to MongoDB: ${dbName}`))
   .catch((err) => {
      console.error(`Error connecting to MongoDB: ${err}`);
      process.exit(1);
   });
