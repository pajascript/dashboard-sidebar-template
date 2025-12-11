import { MongoClient, Db } from "mongodb";

if (!process.env.MONGODB_URI) {
  throw new Error('Invalid/Missing environment variable: "MONGODB_URI"');
}

const uri = process.env.MONGODB_URI;
const options = {};

let client: MongoClient;
let clientPromise: Promise<MongoClient>;

// In development, use a global variable to preserve the client across hot reloads
// In production, create a new client for each request
declare global {
  // eslint-disable-next-line no-var
  var _mongoClientPromise: Promise<MongoClient> | undefined;
}

if (process.env.NODE_ENV === "development") {
  // In development mode, use a global variable so the MongoClient is not constantly recreated
  if (!global._mongoClientPromise) {
    client = new MongoClient(uri, options);
    global._mongoClientPromise = client.connect();
  }
  clientPromise = global._mongoClientPromise;
} else {
  // In production, create a new client
  client = new MongoClient(uri, options);
  clientPromise = client.connect();
}

/**
 * Get MongoDB client
 * Usage: const client = await getMongoClient();
 */
export async function getMongoClient(): Promise<MongoClient> {
  return clientPromise;
}

/**
 * Get MongoDB database
 * Usage: const db = await getDatabase();
 */
export async function getDatabase(): Promise<Db> {
  const client = await getMongoClient();
  return client.db(process.env.MONGODB_DB || "saas-training");
}

/**
 * Get a specific collection
 * Usage: const transactions = await getCollection("transactions");
 */
export async function getCollection<T = any>(collectionName: string) {
  const db = await getDatabase();
  return db.collection<T>(collectionName);
}

