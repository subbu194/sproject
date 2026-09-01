import mongoose, { Document, Schema } from 'mongoose';

export interface ISettings extends Document {
  heroVideoUrl: string;
}

const SettingsSchema: Schema = new Schema(
  {
    heroVideoUrl: { type: String, default: '' },
  },
  { timestamps: true }
);

// We will only ever have one document in this collection
export default mongoose.model<ISettings>('Settings', SettingsSchema);
