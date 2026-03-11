import mongoose from 'mongoose';

export async function connectDatabase(): Promise<void> {
  const uri = process.env.DB_URL;
  if (!uri) {
    console.error('❌ DB_URL is not set in environment variables');
    process.exit(1);
  }

  try {
    await mongoose.connect(uri);
    console.log('✅ MongoDB connected');
  } catch (err) {
    console.error('❌ MongoDB connection error:', err);
    process.exit(1);
  }
}
