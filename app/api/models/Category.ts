import mongoose, { Model } from "mongoose";

export interface ICategory {
  name: string;
  description?: string;
}

export interface ICategoryDocument extends ICategory, mongoose.Document {
  createdAt: Date;
  updatedAt: Date;
}
const categorySchema = new mongoose.Schema<ICategoryDocument>({
  name: {
    type: String,
    required: true,
    trim: true,
  },
});

const Category: Model<ICategoryDocument> =
  mongoose.models.Category ||
  mongoose.model<ICategoryDocument>("Category", categorySchema);

export default Category;
