import mongoose, { Document, Model, Schema } from "mongoose";

export interface ISavingGoal {
  userId: mongoose.Types.ObjectId;
  name: string;
  goalAmount: number;
  currentAmount: number;
}

export interface ISavingGoalDocument extends ISavingGoal, Document {
  createdAt: Date;
  updatedAt: Date;
}

const savingGoalSchema = new Schema<ISavingGoalDocument>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    goalAmount: {
      type: Number,
      required: true,
      min: 0,
    },
    currentAmount: {
      type: Number,
      required: true,
      default: 0,
      min: 0,
    },
  },
  { timestamps: true }
);

savingGoalSchema.index({ userId: 1 });

const SavingGoal: Model<ISavingGoalDocument> =
  mongoose.models.SavingGoal ||
  mongoose.model<ISavingGoalDocument>("SavingGoal", savingGoalSchema);

export default SavingGoal;
