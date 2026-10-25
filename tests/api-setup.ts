import { beforeAll, afterAll, beforeEach } from "bun:test";
import { MongoClient, type Db } from "mongodb";
import {
  createHttpClient,
  HttpClientError,
} from "@mit-sdg/sync-engine-http/client";
import { type Client } from "@mit-sdg/sync-engine/client";
import type { BoHWireHttp } from "../generated/wire.ts";
import { type TestDb, openTestDb } from "./test-db.ts";
import { assembleApplication } from "../src/assembly.ts";
import { createGateway } from "@mit-sdg/sync-engine/boundary";
import { createHttpHandler } from "@mit-sdg/sync-engine-http/handler";
import { policy } from "../src/http.ts";

/**
 * This script simulates a client and tests the functionality of endpoints in node, without needing a frontend.
 */
export let client: Client<BoHWireHttp, HttpClientError>;

export let testDb: TestDb;
let server: Bun.Server<undefined>;

beforeAll(async () => {
  // Start the test db
  testDb = await openTestDb();

  // assemble server
  const application = assembleApplication(testDb.db);
  const gateway = createGateway({ application });
  const api = createHttpHandler({ application, gateway, policy });

  // start server
  server = Bun.serve({
    hostname: process.env.HOST ?? "127.0.0.1",
    port: Number(process.env.PORT ?? 3001),
    routes: {
      "/api/*": api,
      "/health": async () => {
        try {
          await testDb.db
            .collection("joining.contexts")
            .findOne({}, { maxTimeMS: 2000, timeoutMS: 3000 });
          return Response.json(
            { status: "ok" },
            { headers: { "Cache-Control": "no-store" } },
          );
        } catch {
          return Response.json(
            { status: "unavailable" },
            { status: 503, headers: { "Cache-Control": "no-store" } },
          );
        }
      },
    },
  });

  // instantiate client
  client = createHttpClient<BoHWireHttp>({
    baseUrl: "http://127.0.0.1:3001/api",
  });
});

afterAll(async () => {
  // Gracefully close everything down
  await testDb.close();
  await server.stop();
});

beforeEach(async () => {
  const collections = await testDb.db.collections();
  for (const collection of collections) {
    await collection.deleteMany({});
  }
});
