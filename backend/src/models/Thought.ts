import mongoose, { Schema, Document } from 'mongoose';

export interface IThought extends Document {
  topic: string;
  title: string;
  summary: string;
  slug: string;
  published: boolean;
  order: number;
}

const ThoughtSchema = new Schema<IThought>(
  {
    topic: { type: String, required: true },
    title: { type: String, required: true },
    summary: { type: String, required: true },
    slug: { type: String, unique: true },
    published: { type: Boolean, default: false },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

// Auto-generate slug from title before validate
ThoughtSchema.pre('validate', function () {
  if (this.isModified('title') || !this.slug) {
    this.slug = this.title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  }
});

export default mongoose.model<IThought>('Thought', ThoughtSchema);
