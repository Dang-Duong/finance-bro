import mongoose, { Document, Model, Schema } from "mongoose";
import { IUserDocument } from "./User";

export interface ITransaction {
  amount: number;
  description?: string;
  state?: "pending" | "completed" | "failed";
  category?: mongoose.Types.ObjectId;
  incoming: boolean;
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
    category: {
      type: Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    state: {
      type: String,
      enum: ["card", "cash", "investment", "saving"],
      default: "card",
      required: true,
    },
    incoming: {
      type: Boolean,
      required: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    date: {
      type: Date,
      required: false,
      default: Date.now,
    },
  },
  { timestamps: true }
);

const Transaction: Model<ITransactionDocument> =
  mongoose.models.Transaction ||
  mongoose.model<ITransactionDocument>("Transaction", transactionSchema);

export default Transaction;
