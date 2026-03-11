import { S3Client } from '@aws-sdk/client-s3';

let r2Client: S3Client | null = null;

export async function initializeR2(): Promise<S3Client | null> {
  const endpoint = process.env.R2_ENDPOINT;
  const accessKeyId = process.env.R2_ACCESS_KEY_ID;
  const secretAccessKey = process.env.R2_SECRET_ACCESS_KEY;

  if (!endpoint || !accessKeyId || !secretAccessKey) {
    console.warn('⚠️  R2 credentials not configured — file uploads disabled');
    return null;
  }

  r2Client = new S3Client({
    region: 'auto',
    endpoint,
    credentials: {
      accessKeyId,
      secretAccessKey,
    },
  });

  console.log('✅ R2 storage initialized');
  return r2Client;
}

export function getR2Client(): S3Client {
  if (!r2Client) {
    throw new Error('R2 client not initialized. Call initializeR2() first.');
  }
  return r2Client;
}
