import mongoose, { Schema, Document } from 'mongoose';

export interface ILogEntry extends Document {
  date: Date;
  title: string;
  body: string;
  tags: string[];
  published: boolean;
}

const LogEntrySchema = new Schema<ILogEntry>(
  {
    date: { type: Date, required: true, default: Date.now },
    title: { type: String, required: true },
    body: { type: String, required: true },
    tags: [{ type: String }],
    published: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default mongoose.model<ILogEntry>('LogEntry', LogEntrySchema);
