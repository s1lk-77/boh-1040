import { MongoClient } from "mongodb";

const url =
  process.env.MONGODB_URL ?? "mongodb://127.0.0.1:27017/bag-of-holding";
// With --wait, keep trying for 30 seconds. That gives a fresh container time to start.
const timeout = process.argv.includes("--wait") ? 30_000 : 3_000;
const client = new MongoClient(url, { serverSelectionTimeoutMS: timeout });

try {
  await client.connect();
  const db = client.db();
  await db.command({ ping: 1 });
  const checks = db.collection("setup_checks");
  await checks.insertOne({ at: new Date() });
  console.log(
    `Connected to ${db.databaseName}. It has ${await checks.countDocuments()} check(s).`,
  );
  const catalogs = db.collection("cataloging.catalogs");
  const catalogObj = await catalogs.findOne({ name: "abils" });
  const games = db.collection("joining.contexts");
  const gamesObj = await games.findOne({ identifier: "test1" });
  const keysCollection = db.collection("naming.keys");
  const keysObj = await keysCollection.findOne({});
  const inventories = db.collection("inventorying.inventories");
  const inventoryObj = await inventories.findOne({ owner: "test1" });
  const abil = catalogObj!.entries.filter(
    (entry) => entry.entry === "sp-986@moonrise",
  )[0];
  console.log(abil);
  console.log(gamesObj);
  console.log(keysObj);
  console.log(inventoryObj);
} catch (error) {
  console.error(`Could not reach MongoDB at ${url}`);
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
} finally {
  await client.close();
}
