import express, { Request, Response, NextFunction } from "express";
import multer, { FileFilterCallback, StorageEngine } from "multer";
import { join } from "path";
import { Controllers } from "../controllers/uploadfile";
// import { db } from "../db/db";
let generatedFilePath: string = "";
export const router = express.Router();
//

const storage: StorageEngine = multer.diskStorage({
   destination: (
      req: Request,
      file: Express.Multer.File,
      callback: (error: Error | null, destination: string) => void
   ): void => {
      return callback(
         null,
         (generatedFilePath = join(__dirname, "../uploaded_files"))
      );
   },
   filename: (
      req: Request,
      file: Express.Multer.File,
      callback: (error: Error | null, filename: string) => void
   ): void => {
      console.log(file);
      console.log("i am in file");
      return callback(null, `${Date.now()}-${file.originalname}`);
   },
});

const fileFilter = (
   req: Request,
   file: Express.Multer.File,
   callback: FileFilterCallback
) => {
   console.log(file);
   if (!file.originalname.match(/\.(csv)$/)) {
      return callback(new Error("Please upload csv file"));
   }
   callback(null, true);
};

const upload = multer({
   storage,
   fileFilter,
   limits: {
      fileSize: 50000000, //50mb
   },
});
router.post("/upload", upload.single("file"), Controllers.uploadFileFeedback);

router.get("/", Controllers.getFileData);

router.get("/subscription-price", Controllers.calculateSubPrice);

//apart from assignment
router.get("/jsontocsv", Controllers.uploadToCsv);
