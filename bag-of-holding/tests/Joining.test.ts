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
    await expect(
      joining.create({ id: "moonrise", name: "Test" }),
    ).rejects.toThrow("Key already exists.");
  });
});

describe("join", () => {
  test("covers valid context, new member", async () => {
    await joining.create({ id: "moonrise", name: "Moonrise" });
    const res = await joining.join({ id: "moonrise", member: "yfnse" });
    expect(res.member).toBe("yfnse");
  });

  test("covers valid context, existing member", async () => {
    await joining.create({ id: "moonrise", name: "Moonrise" });
    await joining.join({ id: "moonrise", member: "yfnse" });
    await expect(
      joining.join({ id: "moonrise", member: "yfnse" }),
    ).rejects.toThrow("member yfnse already exists in context moonrise");
  });

  test("covers invalid context", async () => {
    await expect(
      joining.join({ id: "moonrise", member: "yfnse" }),
    ).rejects.toThrow("No context with id moonrise exists");
  });
});

describe("isContext", () => {
  test("covers valid context", async () => {
    await joining.create({ id: "moonrise", name: "Moonrise" });
    await expect(joining._isContext({ id: "moonrise" })).resolves.toEqual({
      isContext: true,
    });
  });

  test("covers inalid context", async () => {
    await expect(joining._isContext({ id: "moonrise" })).resolves.toEqual({
      isContext: false,
    });
  });
});

describe("isMember", () => {
  test("covers valid context, non existent member", async () => {
    await joining.create({ id: "moonrise", name: "Moonrise" });
    await expect(
      joining._isMember({ id: "moonrise", member: "yfnse" }),
    ).resolves.toEqual({
      isMember: false,
    });
  });

  test("covers valid context, existing member", async () => {
    await joining.create({ id: "moonrise", name: "Moonrise" });
    await joining.join({ id: "moonrise", member: "yfnse" });
    await expect(
      joining._isMember({ id: "moonrise", member: "yfnse" }),
    ).resolves.toEqual({
      isMember: true,
    });
  });

  test("covers invalid context", async () => {
    await expect(
      joining._isMember({ id: "moonrise", member: "yfnse" }),
    ).resolves.toEqual({
      isMember: false,
    });
  });
});

describe("getName", () => {
  test("covers valid context", async () => {
    await joining.create({ id: "moonrise", name: "Moonrise" });
    await expect(joining._getName({ id: "moonrise" })).resolves.toEqual({
      name: "Moonrise",
    });
  });

  test("covers inalid context", async () => {
    await expect(joining._getName({ id: "moonrise" })).resolves.toEqual({
      name: null,
    });
  });
});
