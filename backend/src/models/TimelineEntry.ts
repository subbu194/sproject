import mongoose, { Schema, Document } from 'mongoose';

export interface ITimelineEntry extends Document {
  year: string;
  title: string;
  description: string;
  order: number;
}

const TimelineEntrySchema = new Schema<ITimelineEntry>(
  {
    year: { type: String, required: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default mongoose.model<ITimelineEntry>('TimelineEntry', TimelineEntrySchema);
