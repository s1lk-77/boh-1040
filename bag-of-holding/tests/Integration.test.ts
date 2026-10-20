/** Integration tests for the edit and collect endpoints (which should be tested together) */
import { describe, test, expect, beforeEach } from "bun:test";
import "./api-setup"; // Triggers our database lifecycles
import { client } from "./api-setup";

/* ******* TESTS ********* */

beforeEach(async () => {
  await client["/portal/create-game"]({
    gameCode: "moonrise",
    gameName: "Moonrise",
  });
  await client["/portal/open-bag"]({
    gameCode: "moonrise",
    playerName: "yfnse",
  });
  await client["/portal/start"]({});
});

const gameCode = "moonrise";
const playerName = "yfnse";
const lookup = "entry";

// integration tests for the edit endpoints

describe("add, print, update", () => {
  test("add should be able to add an entry", async () => {
    const res1 = await client["/edit/add-entry"]({ gameCode, lookup });
    expect(res1).toEqual({ gameCode, lookup });
    const res1a = await client["/collect/print"]({
      gameCode,
      lookup,
      playerName,
    });
    expect(res1a).toStrictEqual({
      abil: {
        card: [
          { feature: "MYlookup", value: "" },
          { feature: "MYname", value: "" },
          { feature: "MYtext", value: "" },
          { feature: "MYeffect", value: "" },
        ],
      },
    });
    const res2 = await client["/edit/update-entry"]({
      gameCode,
      lookup,
      feature: "MYname",
      value: "name1",
    });
    expect(res2).toHaveProperty("entry");
    const res2a = await client["/collect/production"]({
      gameCode,
      playerName,
    });
    expect(res2a).toStrictEqual({
      abils: {
        cards: [
          {
            card: [
              { feature: "MYlookup", value: "" },
              { feature: "MYname", value: "name1" },
              { feature: "MYtext", value: "" },
              { feature: "MYeffect", value: "" },
            ],
          },
        ],
      },
    });
  });
});

describe("update-name", () => {
  test("should be able to change gameName", async () => {
    const updateRes = await client["/edit/update-name"]({
      gameCode,
      gameName: "New Moonrise",
    });
    expect(updateRes).toEqual({ gameName: "New Moonrise" });

    const nameRes = await client["/portal/name"]({ gameCode });
    expect(nameRes).toEqual({ gameName: "New Moonrise" });
  });

  test("should refuse to update gameName for nonexistent game", async () => {
    const res = await client["/edit/update-name"]({
      gameCode: "nonexistent",
      gameName: "Fake Game",
    });
    expect(res).toEqual({ error: "NOT_FOUND" });
  });
});

describe("collect/admin", () => {
  test("should retrieve all entries and updated features in the compendium", async () => {
    // Add first entry and update its features
    const addRes1 = await client["/edit/add-entry"]({
      gameCode,
      lookup: "abil-1",
    });
    expect(addRes1).toEqual({ gameCode, lookup: "abil-1" });

    await client["/edit/update-entry"]({
      gameCode,
      lookup: "abil-1",
      feature: "MYlookup",
      value: "abil-1",
    });
    await client["/edit/update-entry"]({
      gameCode,
      lookup: "abil-1",
      feature: "MYname",
      value: "Fireball",
    });
    await client["/edit/update-entry"]({
      gameCode,
      lookup: "abil-1",
      feature: "MYtext",
      value: "Hurls a ball of fire.",
    });
    await client["/edit/update-entry"]({
      gameCode,
      lookup: "abil-1",
      feature: "MYeffect",
      value: "Deals 5 fire damage.",
    });

    // Add second entry and update its features
    const addRes2 = await client["/edit/add-entry"]({
      gameCode,
      lookup: "abil-2",
    });
    expect(addRes2).toEqual({ gameCode, lookup: "abil-2" });

    await client["/edit/update-entry"]({
      gameCode,
      lookup: "abil-2",
      feature: "MYlookup",
      value: "abil-2",
    });
    await client["/edit/update-entry"]({
      gameCode,
      lookup: "abil-2",
      feature: "MYname",
      value: "Heal",
    });
    await client["/edit/update-entry"]({
      gameCode,
      lookup: "abil-2",
      feature: "MYtext",
      value: "Restores vitality.",
    });
    await client["/edit/update-entry"]({
      gameCode,
      lookup: "abil-2",
      feature: "MYeffect",
      value: "Heals 10 HP.",
    });

    // Retrieve all information via the compendium endpoint (/collect/admin)
    const res = await client["/collect/admin"]({ gameCode });

    expect(res).toStrictEqual({
      abils: {
        cards: [
          {
            card: [
              { feature: "MYlookup", value: "abil-1" },
              { feature: "MYname", value: "Fireball" },
              { feature: "MYtext", value: "Hurls a ball of fire." },
              { feature: "MYeffect", value: "Deals 5 fire damage." },
            ],
          },
          {
            card: [
              { feature: "MYlookup", value: "abil-2" },
              { feature: "MYname", value: "Heal" },
              { feature: "MYtext", value: "Restores vitality." },
              { feature: "MYeffect", value: "Heals 10 HP." },
            ],
          },
        ],
      },
    });
  });

  test("should refuse to retrieve compendium for nonexistent game", async () => {
    const res = await client["/collect/admin"]({
      gameCode: "nonexistent",
    });
    expect(res).toEqual({ error: "NOT_FOUND" });
  });
});

describe("add, update delete", () => {
  test("should retrieve all entries and updated features in the compendium", async () => {
    // Add first entry and update its features
    const addRes1 = await client["/edit/add-entry"]({
      gameCode,
      lookup: "abil-1",
    });
    expect(addRes1).toEqual({ gameCode, lookup: "abil-1" });

    await client["/edit/update-entry"]({
      gameCode,
      lookup: "abil-1",
      feature: "MYlookup",
      value: "abil-1",
    });
    await client["/edit/update-entry"]({
      gameCode,
      lookup: "abil-1",
      feature: "MYname",
      value: "Fireball",
    });
    await client["/edit/update-entry"]({
      gameCode,
      lookup: "abil-1",
      feature: "MYtext",
      value: "Hurls a ball of fire.",
    });
    await client["/edit/update-entry"]({
      gameCode,
      lookup: "abil-1",
      feature: "MYeffect",
      value: "Deals 5 fire damage.",
    });

    // Add second entry and update its features
    const addRes2 = await client["/edit/add-entry"]({
      gameCode,
      lookup: "abil-2",
    });
    expect(addRes2).toEqual({ gameCode, lookup: "abil-2" });

    await client["/edit/update-entry"]({
      gameCode,
      lookup: "abil-2",
      feature: "MYlookup",
      value: "abil-2",
    });
    await client["/edit/update-entry"]({
      gameCode,
      lookup: "abil-2",
      feature: "MYname",
      value: "Heal",
    });
    await client["/edit/update-entry"]({
      gameCode,
      lookup: "abil-2",
      feature: "MYtext",
      value: "Restores vitality.",
    });
    await client["/edit/update-entry"]({
      gameCode,
      lookup: "abil-2",
      feature: "MYeffect",
      value: "Heals 10 HP.",
    });

    // Delete
    await client["/edit/delete-entry"]({
      gameCode,
      lookup: "abil-1",
    });

    const res = await client["/collect/admin"]({
      gameCode,
    });

    expect(res).toStrictEqual({
      abils: {
        cards: [
          {
            card: [
              { feature: "MYlookup", value: "abil-2" },
              { feature: "MYname", value: "Heal" },
              { feature: "MYtext", value: "Restores vitality." },
              { feature: "MYeffect", value: "Heals 10 HP." },
            ],
          },
        ],
      },
    });
  });

  test("should refuse to retrieve compendium for nonexistent game", async () => {
    const res = await client["/edit/delete-entry"]({
      gameCode,
      lookup,
    });
    expect(res).toEqual({ error: "NOT_FOUND" });
  });
});

describe("invalid update entries", () => {
  test("should not update entry when feature does not match", async () => {
    // Add first entry and update its features
    const addRes1 = await client["/edit/add-entry"]({
      gameCode,
      lookup: "abil-1",
    });
    expect(addRes1).toEqual({ gameCode, lookup: "abil-1" });

    await client["/edit/update-entry"]({
      gameCode,
      lookup: "abil-1",
      feature: "MYlookup",
      value: "abil-1",
    });
    await client["/edit/update-entry"]({
      gameCode,
      lookup: "abil-1",
      feature: "MYname",
      value: "Fireball",
    });
    await client["/edit/update-entry"]({
      gameCode,
      lookup: "abil-1",
      feature: "MYtext",
      value: "Hurls a ball of fire.",
    });
    await client["/edit/update-entry"]({
      gameCode,
      lookup: "abil-1",
      feature: "MYeffect",
      value: "Deals 5 fire damage.",
    });

    const res = await client["/edit/update-entry"]({
      gameCode,
      lookup: "abil-1",
      feature: "dne",
      value: "irrelevant",
    });

    expect(res).toEqual({ error: "CONFLICT" });
  });
});
