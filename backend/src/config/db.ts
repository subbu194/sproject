import dns from 'dns';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';

const DEFAULT_LOCAL_URI = 'mongodb://127.0.0.1:27017/salmanproject';
const PUBLIC_DNS_SERVERS = ['8.8.8.8', '1.1.1.1'];

export async function connectDatabase(): Promise<void> {
  const configuredUri = process.env.DB_URL;
  const localUri = process.env.LOCAL_DB_URL || DEFAULT_LOCAL_URI;
  const isProduction = process.env.NODE_ENV === 'production';

  let memoryServer: MongoMemoryServer | null = null;

  const connect = async (uri: string) => {
    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
      family: 4,
    });
  };

  const forcePublicDns = () => {
    const servers = process.env.DB_DNS_SERVERS
      ? process.env.DB_DNS_SERVERS.split(',').map((s) => s.trim()).filter(Boolean)
      : PUBLIC_DNS_SERVERS;

    dns.setServers(servers);
    console.log(`ℹ️ Using DNS servers for MongoDB SRV lookup: ${servers.join(', ')}`);
  };

  const isSrvUri = (uri: string) => uri.startsWith('mongodb+srv://');

  const createMemoryServer = async () => {
    memoryServer = await MongoMemoryServer.create();
    return memoryServer.getUri();
  };

  const tryUri = async (uri: string, label: string, warnOnFail = true) => {
    try {
      await connect(uri);
      console.log(`✅ MongoDB connected (${label})`);
      return true;
    } catch (err) {
      if (warnOnFail) {
        const message = err instanceof Error ? err.message : String(err);
        console.warn(`⚠️ MongoDB connection failed (${label}): ${message}`);
      }
      return false;
    }
  };

  const tryUriWithPublicDns = async (uri: string, label: string) => {
    forcePublicDns();
    return await tryUri(uri, `${label} (public DNS)`, false);
  };

  const allowFallback = process.env.DB_ALLOW_FALLBACK === 'true' || process.env.DB_ALLOW_FALLBACK === '1';

  if (configuredUri) {
    const succeeded = await tryUri(configuredUri, 'configured DB_URL');
    if (succeeded) {
      return;
    }

    if (isSrvUri(configuredUri)) {
      console.warn('⚠️ SRV lookup failed for DB_URL. Retrying with public DNS servers.');
      const publicSucceeded = await tryUriWithPublicDns(configuredUri, 'configured DB_URL');
      if (publicSucceeded) {
        return;
      }
    }

    if (isProduction && !allowFallback) {
      console.error('❌ DB_URL failed in production. Fallback is disabled by default in production.');
      console.error('   Set DB_ALLOW_FALLBACK=true only if you want production to use local or in-memory fallback.');
      process.exit(1);
    }

    console.warn('⚠️ DB_URL is not reachable. Falling back to the next available database option.');
  } else if (isProduction) {
    console.error('❌ DB_URL is required in production but is not configured. Set DB_URL and restart.');
    process.exit(1);
  } else {
    console.warn('⚠️ DB_URL is not configured. Using fallback database options.');
  }

  if (localUri && localUri !== configuredUri) {
    if (isProduction && !allowFallback) {
      console.error('❌ Local fallback is disabled in production. Enable DB_ALLOW_FALLBACK to allow it.');
      process.exit(1);
    }

    const succeeded = await tryUri(localUri, 'local MongoDB');
    if (succeeded) {
      return;
    }
  }

  if (isProduction && !allowFallback) {
    console.error('❌ No usable MongoDB connection for production. Disable production mode or set DB_URL correctly.');
    process.exit(1);
  }

  const memoryUri = await createMemoryServer();
  const succeeded = await tryUri(memoryUri, 'in-memory MongoDB', false);
  if (succeeded) {
    console.warn('⚠️ Using temporary in-memory MongoDB. Data will be lost when the process exits.');
    if (isProduction) {
      console.warn('⚠️ Production fallback is active. Fix DB_URL or local MongoDB to avoid data loss.');
    }
    return;
  }

  console.error('❌ MongoDB connection could not be established on any available URI.');
  if (isProduction) {
    console.error('❌ Production fallback failed. Check DB_URL, local MongoDB, or network connectivity.');
  }
  process.exit(1);
}
