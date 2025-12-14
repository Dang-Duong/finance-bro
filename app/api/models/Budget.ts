import mongoose, { Document, Model, Schema } from "mongoose";

export interface IBudget {
  userId: mongoose.Types.ObjectId;
  category: mongoose.Types.ObjectId;
  amount: number;
  month: number; // 0-11
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

// Index pro rychlé vyhledávání budgetů uživatele za konkrétní měsíc a rok
budgetSchema.index({ userId: 1, month: 1, year: 1 });
// Index pro vyhledávání konkrétního budgetu (user + kategorie + měsíc + rok)
budgetSchema.index(
  { userId: 1, category: 1, month: 1, year: 1 },
  { unique: true }
);

const Budget: Model<IBudgetDocument> =
  mongoose.models.Budget ||
  mongoose.model<IBudgetDocument>("Budget", budgetSchema);

export default Budget;
