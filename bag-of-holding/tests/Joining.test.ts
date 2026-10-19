/** Tests for the Joining concept */
import {
  afterAll,
  beforeAll,
  beforeEach,
  expect,
  test,
  describe,
} from "bun:test";
import { JoiningConcept } from "../src/concepts/Joining.ts";
import { openTestDb, type TestDb } from "./test-db.ts";

let testDb: TestDb;
let joining: JoiningConcept;

/* ****** SETUP ****** */
beforeAll(async () => {
  testDb = await openTestDb();
}, 120_000);

beforeEach(async () => {
  await testDb.db.dropDatabase();
  joining = new JoiningConcept(testDb.db);
});

afterAll(async () => {
  await testDb.close();
});

/* ******* TESTS ********* */

/**
 * Testing strategy:
 *
 * create
 * - partition on context: extant, nonexistent
 *
 * join
 * - partition on context: valid, invalid
 * - partition on member: valid, invalid
 *
 * isMember
 * - partition on context: valid, invalid
 * - partition on member: valid, invalid
 *
 * isContext
 * - partition on context: valid, invalid
 * - partition on member: valid, invalid
 *
 * getName
 * - partition on context: extant, nonexistent
 */

describe("create", () => {});

describe("join", () => {});

describe("isContext", () => {});

describe("isMember", () => {});

describe("getName", () => {});
