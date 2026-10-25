/** Tests for the Inventorying concept */
import {
  afterAll,
  beforeAll,
  beforeEach,
  expect,
  test,
  describe,
} from "bun:test";
import { InventoryingConcept } from "../src/concepts/Inventorying.ts";
import { openTestDb, type TestDb } from "./test-db.ts";

let testDb: TestDb;
let inventorying: InventoryingConcept;

/* ****** SETUP ****** */
beforeAll(async () => {
  testDb = await openTestDb();
}, 120_000);

beforeEach(async () => {
  await testDb.db.dropDatabase();
  inventorying = new InventoryingConcept(testDb.db);
});

afterAll(async () => {
  await testDb.close();
});

/* ******* TESTS ********* */

/**
 * Testing strategy:
 *
 * make
 * - partition on owner: extant, nonexistent
 *
 * add
 * - partition on owner: extant, nonexistent
 * - partition on item: new, existing
 *
 * remove
 * - partition on owner: extant, nonexistent
 * - partition on item: nonexistent, exists
 *
 * delete
 * - partition on owner: extant, nonexistent
 *
 * owns
 * - partition on owner: extant, nonexistent
 * - partition on item: owned, unowned
 *
 * getAll
 * - partition on owner: extant, nonexistent
 * - partition on inventory: empty, non empty
 */

describe("make", () => {
  test("valid owner", async () => {
    await expect(inventorying.make({ owner: "yfnse" })).resolves.toEqual({
      owner: "yfnse",
    });
  });

  test("invalid owner", async () => {
    await inventorying.make({ owner: "yfnse" });
    await expect(inventorying.make({ owner: "yfnse" })).rejects.toThrow(
      "Inventory already exists.",
    );
  });
});

describe("add", () => {
  test("valid owner, new item", async () => {
    await inventorying.make({ owner: "yfnse" });
    await expect(
      inventorying.add({ owner: "yfnse", item: "thing" }),
    ).resolves.toEqual({
      item: "thing",
    });
  });

  test("valid owner, existing item", async () => {
    await inventorying.make({ owner: "yfnse" });
    await inventorying.add({ owner: "yfnse", item: "thing" });
    await expect(
      inventorying.add({ owner: "yfnse", item: "thing" }),
    ).rejects.toThrow();
  });

  test("invalid owner", async () => {
    await expect(
      inventorying.add({ owner: "yfnse", item: "thing" }),
    ).rejects.toThrow();
  });
});

describe("remove", () => {
  test("valid owner, existing item", async () => {
    await inventorying.make({ owner: "yfnse" });
    await inventorying.add({ owner: "yfnse", item: "thing" });
    await expect(
      inventorying.remove({ owner: "yfnse", item: "thing" }),
    ).resolves.toEqual({ item: "thing" });
  });

  test("valid owner, nonexistent item", async () => {
    await inventorying.make({ owner: "yfnse" });
    await expect(
      inventorying.remove({ owner: "yfnse", item: "thing" }),
    ).rejects.toThrow();
  });

  test("invalid owner", async () => {
    await expect(
      inventorying.remove({ owner: "yfnse", item: "thing" }),
    ).rejects.toThrow();
  });
});

describe("delete", () => {
  test("valid owner", async () => {
    await inventorying.make({ owner: "yfnse" });
    await expect(inventorying.delete({ owner: "yfnse" })).resolves.toEqual({
      owner: "yfnse",
    });
  });

  test("invalid owner", async () => {
    await expect(inventorying.delete({ owner: "yfnse" })).rejects.toThrow();
  });
});

describe("owns", () => {
  test("valid owner, owned item", async () => {
    await inventorying.make({ owner: "yfnse" });
    await inventorying.add({ owner: "yfnse", item: "thing" });
    await expect(
      inventorying._owns({ owner: "yfnse", item: "thing" }),
    ).resolves.toEqual({ owns: true });
  });

  test("valid owner, unowned item", async () => {
    await inventorying.make({ owner: "yfnse" });
    await inventorying.add({ owner: "yfnse", item: "thing" });
    await expect(
      inventorying._owns({ owner: "yfnse", item: "thing2" }),
    ).resolves.toEqual({ owns: false });
  });

  test("invalid owner", async () => {
    await expect(
      inventorying._owns({ owner: "yfnse", item: "thing" }),
    ).resolves.toEqual({ owns: false });
  });
});

describe("getAll", () => {
  test("valid owner, empty", async () => {
    await inventorying.make({ owner: "yfnse" });
    await expect(inventorying._getAll({ owner: "yfnse" })).resolves.toEqual([]);
  });

  test("valid owner, nonempty", async () => {
    await inventorying.make({ owner: "yfnse" });
    await inventorying.add({ owner: "yfnse", item: "thing" });
    await expect(
      inventorying._getAll({ owner: "yfnse" }),
    ).resolves.toStrictEqual([{ item: "thing" }]);
  });

  test("invalid owner", async () => {
    await expect(inventorying._getAll({ owner: "yfnse" })).resolves.toEqual([]);
  });
});
