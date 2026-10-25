import { MongoClient, type Db } from "mongodb";

export interface TestDb {
  db: Db;
  close(): Promise<void>;
}

// Opens a fresh database for one test file. By default it uses the real MongoDB
// from compose.yaml. Set TEST_MONGO=memory to start a temporary MongoDB instead.
export async function openTestDb(): Promise<TestDb> {
  let url = process.env.MONGODB_URL;

  if (!url) {
    throw new Error("MONGODB_URL is not set.");
  }

  const client = new MongoClient(url, { serverSelectionTimeoutMS: 3000 });
  try {
    await client.connect();
  } catch {
    throw new Error(
      "Could not reach MongoDB. Start it with `bun run db:up`, or run `bun run test:memory` instead.",
    );
  }
  const db = client.db(`test-${crypto.randomUUID()}`);

  return {
    db,
    async close() {
      await db.dropDatabase();
      await client.close();
    },
  };
}
