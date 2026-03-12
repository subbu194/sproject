import mongoose, { Schema, Document } from 'mongoose';

export interface IAchievement extends Document {
  icon: string;
  title: string;
  description: string;
  year: string;
  order: number;
  images: string[];
}

const AchievementSchema = new Schema<IAchievement>(
  {
    icon: { type: String, default: '🏆' },
    title: { type: String, required: true },
    description: { type: String, required: true },
    year: { type: String, required: true },
    order: { type: Number, default: 0 },
    images: [{ type: String }],
  },
  { timestamps: true }
);

export default mongoose.model<IAchievement>('Achievement', AchievementSchema);
