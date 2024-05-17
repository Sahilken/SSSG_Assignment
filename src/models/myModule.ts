import { Schema, model } from "mongoose";

interface Structure {
   Email: string;
   Name: string;
   CreditScore: number;
   CreditLines: number;
   MaskedPhoneNumber: string;
}
const mySchema = new Schema<Structure>({
   Email: {
      type: String,
   },
   Name: {
      type: String,
   },
   CreditScore: {
      type: Number,
   },
   CreditLines: {
      type: Number,
   },
   MaskedPhoneNumber: {
      type: String,
   },
});

export const User = model<Structure>("User", mySchema);
