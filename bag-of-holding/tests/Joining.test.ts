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

describe("create", () => {
  test("covers nonexistent context, valid create", async () => {
    const res = await joining.create({ id: "moonrise", name: "Moonrise" });
    expect(res.context).toBe("moonrise");
  });

  test("covers extant context, invalid create", async () => {
    await joining.create({ id: "moonrise", name: "Moonrise" });
    expect(joining.create({ id: "moonrise", name: "Test" })).rejects.toThrow(
      "Key already exists.",
    );
  });
});

describe("join", () => {
  test("covers valid context, new member", async () => {});

  test("covers valid context, existing member", async () => {});

  test("covers invalid context", async () => {});
});

describe("isContext", () => {
  test("covers valid context", async () => {});

  test("covers inalid context", async () => {});
});

describe("isMember", () => {
  test("covers valid context, new member", async () => {});

  test("covers valid context, existing member", async () => {});

  test("covers invalid context", async () => {});
});

describe("getName", () => {
  test("covers valid context", async () => {});

  test("covers inalid context", async () => {});
});
