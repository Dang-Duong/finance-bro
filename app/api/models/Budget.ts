import mongoose, { Document, Model, Schema } from "mongoose";

export interface IBudget {
  userId: mongoose.Types.ObjectId;
  category: mongoose.Types.ObjectId;
  amount: number;
  month: number;
  year: number;
}

export interface IBudgetDocument extends IBudget, Document {
  createdAt: Date;
  updatedAt: Date;
}

const budgetSchema = new Schema<IBudgetDocument>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    category: {
      type: Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    amount: {
      type: Number,
      required: true,
      min: 0,
    },
    month: {
      type: Number,
      required: true,
      min: 0,
      max: 11,
    },
    year: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);

budgetSchema.index({ userId: 1, month: 1, year: 1 });
budgetSchema.index(
  { userId: 1, category: 1, month: 1, year: 1 },
  { unique: true }
);

const Budget: Model<IBudgetDocument> =
  mongoose.models.Budget ||
  mongoose.model<IBudgetDocument>("Budget", budgetSchema);

export default Budget;
