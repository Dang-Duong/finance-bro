import mongoose, { Document, Model, Schema } from "mongoose";
import { ITransactionDocument } from "./Transaction";


export interface IUser {
  username: string;
  password: string;
  role: "user" | "admin";
}

export interface IUserDocument extends IUser, Document {
  transactions: mongoose.Types.ObjectId[] | ITransactionDocument[];
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema<IUserDocument>(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    transactions: [
      {
        type: Schema.Types.ObjectId,
        ref: "Transaction",
      },
    ],
  },
  { timestamps: true }
);

const User: Model<IUserDocument> =
  mongoose.models.User || mongoose.model<IUserDocument>("User", userSchema);

export default User;