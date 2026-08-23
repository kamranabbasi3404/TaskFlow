import mongoose from 'mongoose';

const STANDARD_ATLAS_URI =
  'mongodb://kamranali3404_db_user:qYlGC8iOBw39tPYW@ac-n1cjlhd-shard-00-00.3gspnhp.mongodb.net:27017,ac-n1cjlhd-shard-00-01.3gspnhp.mongodb.net:27017,ac-n1cjlhd-shard-00-02.3gspnhp.mongodb.net:27017/trickleup_task_manager?ssl=true&replicaSet=atlas-x67j7h-shard-0&authSource=admin&appName=taskflowcluster';

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
  const uri = process.env.MONGODB_URI || STANDARD_ATLAS_URI;

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
      console.log('✅ Successfully connected to MongoDB Atlas Cluster via Direct Seedlist!');
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
