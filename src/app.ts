import express from "express";
import { router } from "./routes/post.route";
import * as dotenv from "dotenv";
import { db } from "./db/db";
dotenv.config();

const port = process.env.PORT || 3000;
const app = express();

//for parsing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(router);

db.then(() => {
   app.listen(port, () => console.log(`Server is listening on port ${port}`));
});
