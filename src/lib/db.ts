import mongoose from 'mongoose';

interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
  lastFailTime: number;
}

declare global {
  // eslint-disable-next-line no-var
  var mongoose: MongooseCache | undefined;
}

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null, lastFailTime: 0 };
}

export async function connectToDatabase(): Promise<typeof mongoose> {
  const uri = process.env.MONGODB_URI;

  if (!uri) {
    throw new Error('MONGODB_URI is not defined in environment variables');
  }

  if (cached!.conn && cached!.conn.connection.readyState === 1) {
    return cached!.conn;
  }

  // Fast-fail if previously failed within 10 seconds to keep UI responsive
  if (Date.now() - cached!.lastFailTime < 10000) {
    throw new Error('Database connection offline');
  }

  if (!cached!.promise) {
    const opts = {
      bufferCommands: false,
      serverSelectionTimeoutMS: 5000,
      family: 4,
    };

    cached!.promise = mongoose.connect(uri, opts).then((mongooseInstance) => {
      console.log('✅ Successfully connected to MongoDB Atlas Cluster!');
      return mongooseInstance;
    });
  }

  try {
    cached!.conn = await cached!.promise;
    cached!.lastFailTime = 0;
  } catch (e: any) {
    cached!.promise = null;
    cached!.lastFailTime = Date.now();
    console.error('MongoDB Atlas Connection Error:', e.message);
    throw e;
  }

  return cached!.conn;
}
