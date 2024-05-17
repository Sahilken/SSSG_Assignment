import { Request, Response, NextFunction } from "express";
import path from "path";
import csvParser from "csv-parser";
import fs from "fs";
import { User } from "../models/myModule";
import { find } from "lodash";

export class controllers {
   async uploadFileFeedback(
      req: Request | any,
      res: Response,
      next: NextFunction
   ) {
      try {
         console.log("I am in upload cont");
         const filePath = path.join(
            __dirname,
            "../uploaded_files",
            req.file.filename
         );
         const results: any[] = [];
         fs.createReadStream(filePath)
            .pipe(csvParser())
            .on("data", (data) => results.push(data))
            .on("end", async () => {
               try {
                  await User.insertMany(results);
                  console.log(
                     "CSV file imported successfully and imported successfully to database"
                  );
                  res.send(
                     "CSV file imported successfully and imported successfully to database"
                  );
               } catch (err) {
                  next(err);
               }
            });
      } catch (err) {
         console.log(`Multer not working properly because of this ${err}`);
      }
   }

   async calculateSubPrice(req: Request, res: Response, next: NextFunction) {
      try {
         if (!req.query) {
            return res.send({ error: "Please give email address" });
         }
         let BasePrice: number = 100;
         let PricePerCreditLine = 10;
         let PricePerCreditScorePoint = 5;
         let userGivenEmail = req.query.Email;
         const findUser = await User.findOne({ Email: userGivenEmail });
         if (!findUser) {
            return res.status(404).send({ error: "User not found" });
         }
         const CreditScore = findUser.CreditScore;
         const CreditLines = findUser.CreditLines;
         console.log("am i here");
         const SubscriptionPrice =
            BasePrice +
            PricePerCreditLine * CreditLines +
            PricePerCreditScorePoint * CreditScore;

         res.send({ SubscriptionPrice });
      } catch (err) {
         next(err);
      }
   }

   async getFileData(req: Request, res: Response, next: NextFunction) {
      const page = parseInt(req.query.page as string, 10) || 1;
      const limit = parseInt(req.query.limit as string, 10) || 10;

      try {
         const users = await User.find()
            .skip((page - 1) * limit)
            .limit(limit);
         res.json(users);
      } catch (err) {
         next(err);
      }
   }
}

export const Controllers = new controllers();
