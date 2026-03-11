import mongoose, { Schema, Document } from 'mongoose';

export interface ISocialLink extends Document {
  whatsapp: string;
  instagram: string;
  linkedin: string;
  twitter: string;
  email: string;
}

const SocialLinkSchema = new Schema<ISocialLink>(
  {
    whatsapp: { type: String, default: '' },
    instagram: { type: String, default: '' },
    linkedin: { type: String, default: '' },
    twitter: { type: String, default: '' },
    email: { type: String, default: '' },
  },
  { timestamps: true }
);

export default mongoose.model<ISocialLink>('SocialLink', SocialLinkSchema);
