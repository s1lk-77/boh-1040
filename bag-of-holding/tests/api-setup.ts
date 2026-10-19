import { beforeAll, afterAll, beforeEach } from "bun:test";
import { MongoMemoryServer } from "mongodb-memory-server";
import { MongoClient, type Db } from "mongodb";
import {
  createHttpClient,
  HttpClientError,
} from "@mit-sdg/sync-engine-http/client";
import { type Client } from "@mit-sdg/sync-engine/client";
import type { BoHWireHttp } from "../generated/wire.ts";

/**
 * This script simulates a client and tests the functionality of endpoints in node, without needing a frontend.
 */
export let client: Client<BoHWireHttp, HttpClientError>;

let mongoServer: MongoMemoryServer;
export let testClient: MongoClient;
export let testDb: Db;

beforeAll(async () => {
  // Start the in-memory MongoDB instance
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();

  // Establish a client connection
  testClient = new MongoClient(uri);
  await testClient.connect();
  testDb = testClient.db("boh_test_db");

  // Inject this URI or client into configuration/environment
  process.env.MONGODB_URL = uri;

  // instantiate client
  client = createHttpClient<BoHWireHttp>({
    baseUrl: "http://127.0.0.1:3000/api",
  });
});

afterAll(async () => {
  // Gracefully close everything down
  await testClient.close();
  await mongoServer.stop();
});

beforeEach(async () => {
  // Clean up collections between tests to ensure a blank slate
  console.log("cleaning testdatabase");
  const collections = await testDb.collections();
  for (const collection of collections) {
    await collection.deleteMany({});
  }
});
