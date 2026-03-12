import mongoose, { Schema, Document } from 'mongoose';

export interface ILogEntry extends Document {
  date: Date;
  title: string;
  body: string;
  tags: string[];
  images: string[];
  published: boolean;
}

const LogEntrySchema = new Schema<ILogEntry>(
  {
    date: { type: Date, required: true, default: Date.now },
    title: { type: String, required: true },
    body: { type: String, required: true },
    tags: [{ type: String }],
    images: [{ type: String }],
    published: { type: Boolean, default: false },
  },
  { timestamps: true }
);

// Compound index for getting published logs by tag and sorting by date
LogEntrySchema.index({ published: 1, tags: 1, date: -1 });

export default mongoose.model<ILogEntry>('LogEntry', LogEntrySchema);
