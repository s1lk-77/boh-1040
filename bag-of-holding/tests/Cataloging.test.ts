/** Tests for the Cataloging concept */
import {
  afterAll,
  beforeAll,
  beforeEach,
  expect,
  test,
  describe,
} from "bun:test";
import { CatalogingConcept } from "../src/concepts/Cataloging.ts";
import { openTestDb, type TestDb } from "./test-db.ts";

let testDb: TestDb;
let cataloging: CatalogingConcept;

/* ****** SETUP ****** */
beforeAll(async () => {
  testDb = await openTestDb();
}, 120_000);

beforeEach(async () => {
  await testDb.db.dropDatabase();
  cataloging = new CatalogingConcept(testDb.db);
});

afterAll(async () => {
  await testDb.close();
});

/* ******* TESTS ********* */

/**
 * Testing strategy:
 *
 * catalog
 * - partition on input: exists, nonexistent
 *
 * addEntry
 * - partition on entry: exists, doesnt exist
 * - partition on catalog: exists, doesnt exist
 *
 * update
 * - partition on entry: exists, doesnt exist
 * - partition on catalog: exists, doesnt exist
 * - partition on feature: valid, invalid
 *
 * delete
 * - partition on entry: exists, doesnt exist
 * - partition on catalog: exists, doesnt exist
 *
 * isCatalog
 * - partition on catalog: extant, nonexistent
 *
 * get
 * - partition on entry: exists, doesnt exist
 * - partition on catalog: exists, doesnt exist
 *
 * exists
 * - partition on entry: exists, doesnt exist
 * - partition on catalog: exists, doesnt exist
 */

describe("catalog", () => {
  test("valid new catalog", async () => {
    await expect(
      cataloging.catalog({ name: "test", features: ["feature"], default_: "" }),
    ).resolves.toEqual({ catalog: "test" });
  });

  test("invalid new catalog", async () => {
    await cataloging.catalog({
      name: "test",
      features: ["feature"],
      default_: "",
    });
    await expect(
      cataloging.catalog({ name: "test", features: ["feature"], default_: "" }),
    ).rejects.toThrow();
  });
});

describe("addEntry", () => {
  test("duplicate entry", async () => {
    await cataloging.catalog({
      name: "test",
      features: ["feature"],
      default_: "",
    });
    await cataloging.addEntry({
      catalog: "test",
      entry: "entry",
    });
    await expect(
      cataloging.addEntry({ catalog: "test", entry: "entry" }),
    ).rejects.toThrow();
  });

  test("valid entry", async () => {
    await cataloging.catalog({
      name: "test",
      features: ["feature"],
      default_: "",
    });
    await expect(
      cataloging.addEntry({
        catalog: "test",
        entry: "entry",
      }),
    ).resolves.toEqual({ entry: "entry" });
  });

  test("invalid catalog", async () => {
    await expect(
      cataloging.addEntry({ catalog: "test", entry: "entry" }),
    ).rejects.toThrow();
  });
});

describe("update", () => {
  test("valid entry, valid/invalid feature", async () => {
    await cataloging.catalog({
      name: "test",
      features: ["feature"],
      default_: "",
    });
    await cataloging.addEntry({
      catalog: "test",
      entry: "entry",
    });
    await expect(
      cataloging.update({
        catalog: "test",
        entry: "entry",
        feature: "dne",
        value: "hi",
      }),
    ).rejects.toThrow();
    await expect(
      cataloging.update({
        catalog: "test",
        entry: "entry",
        feature: "feature",
        value: "valid",
      }),
    ).resolves.toEqual({ entry: "entry" });
  });

  test("invalid catalog/entry", async () => {
    await expect(
      cataloging.addEntry({ catalog: "test", entry: "entry" }),
    ).rejects.toThrow();
    await cataloging.catalog({
      name: "test",
      features: ["feature"],
      default_: "",
    });
    await cataloging.addEntry({
      catalog: "test",
      entry: "entry",
    });
    await expect(
      cataloging.addEntry({ catalog: "test", entry: "entry" }),
    ).rejects.toThrow();
  });
});

describe("delete", () => {
  test("valid catalog, valid entry", async () => {
    await cataloging.catalog({
      name: "test",
      features: ["feature"],
      default_: "",
    });
    await cataloging.addEntry({
      catalog: "test",
      entry: "entry",
    });
    await expect(
      cataloging.delete({ catalog: "test", entry: "entry" }),
    ).resolves.toEqual({ entry: "entry" });
  });

  test("valid catalog, invalid entry", async () => {
    await cataloging.catalog({
      name: "test",
      features: ["feature"],
      default_: "",
    });
    await expect(
      cataloging.delete({ catalog: "test", entry: "entry" }),
    ).rejects.toThrow();
  });

  test("invalid catalog", async () => {
    await expect(
      cataloging.delete({ catalog: "test", entry: "entry" }),
    ).rejects.toThrow();
  });
});

describe("isCatalog", () => {
  test("valid catalog", async () => {
    await cataloging.catalog({
      name: "test",
      features: ["feature"],
      default_: "",
    });
    await expect(cataloging._isCatalog({ name: "test" })).resolves.toEqual({
      isCatalog: true,
    });
  });

  test("invalid catalog", async () => {
    await expect(cataloging._isCatalog({ name: "test" })).resolves.toEqual({
      isCatalog: false,
    });
  });
});

describe("get", () => {
  test("valid catalog & entry", async () => {
    await cataloging.catalog({
      name: "test",
      features: ["feature"],
      default_: "",
    });
    await cataloging.addEntry({
      catalog: "test",
      entry: "entry",
    });
    await expect(
      cataloging._get({ catalog: "test", entry: "entry" }),
    ).resolves.toStrictEqual([{ feature: "feature", value: "" }]);
  });

  test("invalid catalog/entry", async () => {
    await expect(
      cataloging._get({ catalog: "test", entry: "entry" }),
    ).resolves.toEqual([]);
    await cataloging.catalog({
      name: "test",
      features: ["feature"],
      default_: "",
    });
    await cataloging.addEntry({
      catalog: "test",
      entry: "entry",
    });
    await expect(
      cataloging._get({ catalog: "test", entry: "entry1" }),
    ).resolves.toEqual([]);
  });
});

describe("exists", () => {
  test("valid catalog, extant entry", async () => {
    await cataloging.catalog({
      name: "test",
      features: ["feature"],
      default_: "",
    });
    await cataloging.addEntry({
      catalog: "test",
      entry: "entry",
    });
    await expect(
      cataloging._exists({ catalog: "test", entry: "entry" }),
    ).resolves.toEqual({ exists: true });
  });

  test("valid catalog, nonexistent entry", async () => {
    await cataloging.catalog({
      name: "test",
      features: ["feature"],
      default_: "",
    });
    await expect(
      cataloging._exists({ catalog: "test", entry: "entry" }),
    ).resolves.toEqual({ exists: false });
    await cataloging.addEntry({
      catalog: "test",
      entry: "entry",
    });
    await expect(
      cataloging._exists({ catalog: "test", entry: "entry1" }),
    ).resolves.toEqual({ exists: false });
  });

  test("invalid catalog", async () => {
    await expect(
      cataloging._exists({ catalog: "test", entry: "entry" }),
    ).resolves.toEqual({ exists: false });
  });
});

test("integration: add, update, delete", async () => {
  await cataloging.catalog({
    name: "test",
    features: ["feature"],
    default_: "",
  });
  await cataloging.addEntry({
    catalog: "test",
    entry: "entry",
  });
  const res = await cataloging._get({ catalog: "test", entry: "entry" });
  expect(res).toHaveLength(1);
  expect(res[0].feature).toBe("feature");
  expect(res[0].value).toBe("");
  await cataloging.update({
    catalog: "test",
    entry: "entry",
    feature: "feature",
    value: "testVal",
  });
  const res1 = await cataloging._get({ catalog: "test", entry: "entry" });
  expect(res1).toHaveLength(1);
  expect(res1[0].feature).toBe("feature");
  expect(res1[0].value).toBe("testVal");
  await cataloging.delete({ catalog: "test", entry: "entry" });
  const res2 = await cataloging._get({ catalog: "test", entry: "entry" });
  expect(res2).toStrictEqual([]);
});
