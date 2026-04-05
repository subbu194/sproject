import mongoose, { Schema, Document } from 'mongoose';

export interface IPressItem extends Document {
  outlet: string;
  title: string;
  year: string;
  url: string;
  order: number;
  images: string[];
  imageBlurUrls?: string[];
  isOptimized: boolean;
}

const PressItemSchema = new Schema<IPressItem>(
  {
    outlet: { type: String, required: true },
    title: { type: String, required: true },
    year: { type: String, required: true },
    url: { type: String, default: '' },
    order: { type: Number, default: 0 },
    images: [{ type: String }],
    imageBlurUrls: [{ type: String }],
    isOptimized: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default mongoose.model<IPressItem>('PressItem', PressItemSchema);
