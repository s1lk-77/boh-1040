/** Tests for the Naming concept */
import {
  afterAll,
  beforeAll,
  beforeEach,
  expect,
  test,
  describe,
} from "bun:test";
import { NamingConcept } from "../src/concepts/Naming.ts";
import { openTestDb, type TestDb } from "./test-db.ts";

let testDb: TestDb;
let naming: NamingConcept;

/* ****** SETUP ****** */
beforeAll(async () => {
  testDb = await openTestDb();
}, 120_000);

beforeEach(async () => {
  await testDb.db.dropDatabase();
  naming = new NamingConcept(testDb.db);
});

afterAll(async () => {
  await testDb.close();
});

/* ******* TESTS ********* */

/**
 * Testing strategy:
 *
 * uniquify
 * - partition on input: valid context/suffix pair, invalid pair
 *
 * delete
 * - partition on key: valid key, invalid key
 *
 * getKey
 * - partition on input: valid context/suffix pair, invalid pair
 * - partition on state of database: has some entries, has no entries
 *
 * getValue
 * - partition on key: valid key, invalid key
 * - partition on state of database: has some entries, has no entries
 */

describe("uniquify", () => {
  test("valid context/suffix pair", async () => {
    await expect(
      naming.uniquify({ context: "ctx", suffix: "sfx" }),
    ).resolves.toBeDefined();
  });

  test("invalid context/suffix pair", async () => {
    await naming.uniquify({ context: "ctx", suffix: "sfx" });
    await expect(
      naming.uniquify({ context: "ctx", suffix: "sfx" }),
    ).rejects.toThrow("Key already exists.");
  });
});

describe("delete", () => {
  test("valid key", async () => {
    const { key } = await naming.uniquify({ context: "ctx", suffix: "sfx" });
    await expect(naming.delete({ key })).resolves.toBeDefined();
  });

  test("invalid key", async () => {
    await expect(naming.delete({ key: "dne" })).rejects.toThrow(
      "Cannot delete non existent key",
    );
  });
});

describe("getKey", () => {
  test("valid context/suffix pair, no other entries", async () => {
    const obj = { context: "ctx", suffix: "sfx" };
    const res = await naming.uniquify(obj);
    await expect(naming._getKey(obj)).resolves.toEqual(res);
  });

  test("valid context/suffix pair, has other entries", async () => {
    await naming.uniquify({ context: "ctx1", suffix: "sfx1" });
    const obj = { context: "ctx", suffix: "sfx" };
    const res = await naming.uniquify(obj);
    await expect(naming._getKey(obj)).resolves.toEqual(res);
  });

  test("invalid context/suffix pair, no entries", async () => {
    await expect(
      naming._getKey({ context: "ctx", suffix: "sfx" }),
    ).resolves.toEqual({ key: null });
  });

  test("invalid context/suffix pair, has entries", async () => {
    await naming.uniquify({ context: "ctx1", suffix: "sfx1" });
    await expect(
      naming._getKey({ context: "ctx", suffix: "sfx" }),
    ).resolves.toEqual({ key: null });
  });
});

describe("getValue", () => {
  test("valid key, no entries", async () => {
    const obj = { context: "ctx", suffix: "sfx" };
    const res = await naming.uniquify(obj);
    await expect(naming._getValue(res)).resolves.toEqual(obj);
  });

  test("invalid key, no entries", async () => {
    await expect(naming._getValue({ key: "dne" })).resolves.toEqual({
      context: null,
      suffix: null,
    });
  });

  test("valid key, has other entries", async () => {
    await naming.uniquify({ context: "ctx1", suffix: "sfx1" });
    const obj = { context: "ctx", suffix: "sfx" };
    const res = await naming.uniquify(obj);
    await expect(naming._getValue(res)).resolves.toEqual(obj);
  });

  test("invalid key, has other entries", async () => {
    await naming.uniquify({ context: "ctx1", suffix: "sfx1" });
    await expect(naming._getValue({ key: "dne" })).resolves.toEqual({
      context: null,
      suffix: null,
    });
  });
});
