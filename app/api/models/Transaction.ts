import mongoose, { Document, Model, Schema } from "mongoose";
import { IUserDocument } from "./User";

export interface ITransaction {
  amount: number;
  description?: string;
  state?: "pending" | "completed" | "failed";
  category?: string;
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
      type: String,
      required: false,
    },
    state: {
      type: String,
      enum: ["pending", "completed", "failed"],
      default: "pending",
      required: false,
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
  },
  { timestamps: true }
);

const Transaction: Model<ITransactionDocument> =
  mongoose.models.Transaction ||
  mongoose.model<ITransactionDocument>("Transaction", transactionSchema);

export default Transaction;
