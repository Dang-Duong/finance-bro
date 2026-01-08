import mongoose, { Document, Model, Schema } from "mongoose";

export interface ISavingDeposit {
  userId: mongoose.Types.ObjectId;
  goalId: mongoose.Types.ObjectId;
  amount: number;
  date: Date;
}

export interface ISavingDepositDocument extends ISavingDeposit, Document {
  createdAt: Date;
  updatedAt: Date;
}

const savingDepositSchema = new Schema<ISavingDepositDocument>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    goalId: {
      type: Schema.Types.ObjectId,
      ref: "SavingGoal",
      required: true,
    },
    amount: {
      type: Number,
      required: true,
      min: 0,
    },
    date: {
      type: Date,
      required: true,
      default: Date.now,
    },
  },
  { timestamps: true }
);

savingDepositSchema.index({ userId: 1, goalId: 1 });

const SavingDeposit: Model<ISavingDepositDocument> =
  mongoose.models.SavingDeposit ||
  mongoose.model<ISavingDepositDocument>("SavingDeposit", savingDepositSchema);

export default SavingDeposit;
