import { MongoClient, ServerApiVersion } from 'mongodb';
import 'dotenv/config';

let trelloDatabaseInstance = null;
let clientInstance = null;

const getClientInstance = () => {
  if (!clientInstance) {
    const MONGODB_URI = process.env.MONGODB_URI;

    if (!MONGODB_URI) {
      throw new Error('MONGODB_URI is not defined in environment variables');
    }

    clientInstance = new MongoClient(MONGODB_URI, {
      serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
      },
    });
  }
  return clientInstance;
};

export const CONNECT_DB = async () => {
  const client = getClientInstance();
  await client.connect();

  trelloDatabaseInstance = client.db(process.env.DATABASE_NAME);
  console.log('Connected to MongoDB successfully');
};

export const GET_DB = () => {
  if (!trelloDatabaseInstance)
    throw new Error('Must connect to database before using it');

  return trelloDatabaseInstance;
};
