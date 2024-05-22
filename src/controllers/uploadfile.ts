import { Request, Response, NextFunction } from "express";
import path from "path";
import csvParser from "csv-parser";
import fs from "fs";
import { User } from "../models/myModule";
import { createObjectCsvStringifier } from "csv-writer";

export class controllers {
   async uploadFileFeedback(
      req: Request | any,
      res: Response,
      next: NextFunction
   ) {
      try {
         console.log("I am in upload container");
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
         if (!req.body || !req.body.Email) {
            return res.status(400).send({ error: "Please give email address" });
         }
         let BasePrice: number = 100;
         let PricePerCreditLine = 10;
         let PricePerCreditScorePoint = 5;

         let userEmail = req.body.Email;

         const user = await User.findOne({ Email: userEmail });

         if (!user) {
            return res.status(404).send({ error: "User not found" });
         }

         const CreditScore = user.CreditScore;
         const CreditLines = user.CreditLines;
         console.log("am i here");
         const subscriptionPrice =
            BasePrice +
            PricePerCreditLine * CreditLines +
            PricePerCreditScorePoint * CreditScore;

         res.send({ SubscriptionPrice: subscriptionPrice });
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

   async uploadToCsv(req: Request, res: Response, next: NextFunction) {
      const userData = await User.find({}).lean(); //items
      if (userData.length === 0) {
         return res.status(404).json({ message: "No user data found" });
      }
      const header = Object.keys(userData[0]).map((key) => ({
         id: key,
         title: key,
      }));
      const csvStringifier = createObjectCsvStringifier({ header });

      const csv =
         csvStringifier.getHeaderString() +
         csvStringifier.stringifyRecords(userData);
      res.setHeader("Content-Type", "text/csv");
      res.setHeader("Content-Disposition", 'attachment; filename="users.csv"');
      console.log("CSV file:", csv);
      res.send(csv);
   }
}

export const Controllers = new controllers();
