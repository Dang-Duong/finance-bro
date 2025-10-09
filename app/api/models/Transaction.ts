import mongoose, { Document, Model, Schema } from "mongoose";
import { IUserDocument } from "./User";

export interface ITransaction {
  amount: number;
  description?: string;
  date: Date;
  userId: mongoose.Types.ObjectId;
}

export interface ITransactionDocument extends ITransaction, Document {
  user: mongoose.Types.ObjectId | IUserDocument;
  createdAt: Date;
  updatedAt: Date;
}

const transactionSchema = new Schema<ITransactionDocument>(
  {
    amount: {
      type: Number,
      required: true,
    },
    description: {
      type: String,
      required: false,
    },
    date: {
      type: Date,
      required: true,
      default: Date.now,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

const Transaction: Model<ITransactionDocument> =
  mongoose.models.Transaction ||
  mongoose.model<ITransactionDocument>("Transaction", transactionSchema);

export default Transaction;
