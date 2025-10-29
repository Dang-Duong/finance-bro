import mongoose, { Document, Model, Schema } from "mongoose";
import { ITransactionDocument } from "./Transaction";

export interface IUser {
  username: string;
  password: string;
  email: string;
  name: string;
  surname: string;
  tokens: string[];
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
    email: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    surname: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    tokens: {
      type: [String],
      default: [],
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
