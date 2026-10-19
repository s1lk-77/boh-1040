/** Tests for the Portal endpoints */
import { describe, test, expect } from "bun:test";
import "./api-setup"; // Triggers our database lifecycles
import { client, testDb } from "./api-setup";

/* ******* TESTS ********* */

describe("start", () => {
  test("called on start", async () => {
    const res = await client["/portal/start"]({});
    expect(res).toEqual({});
  });
});

describe("createGame", () => {
  test("valid createGame, followed by invalid create game", async () => {
    await client["/portal/create-game"]({
      gameCode: "moonrise",
      gameName: "Moonrise",
    });
    const res2 = await client["/portal/create-game"]({
      gameCode: "moonrise",
      gameName: "Invalid",
    });
    expect(res2).toEqual({ error: "CONFLICT" });
  });
});

describe("reopenGame", () => {
  test("invalid reopenGame", async () => {
    const res = await client["/portal/reopen-game"]({
      gameCode: "doesnotexistandwillneverexist",
    });
    expect(res).toEqual({ error: "NOT_FOUND" });
  });

  test("valid reopenGame", async () => {
    await client["/portal/create-game"]({
      gameCode: "moonrise",
      gameName: "Moonrise",
    });
    const res = await client["/portal/reopen-game"]({
      gameCode: "moonrise",
    });
    expect(res).toEqual({ gameCode: "moonrise" });
  });
});

describe("reopenBag", () => {
  test("valid reopenBag", async () => {
    await client["/portal/open-bag"]({
      gameCode: "moonrise",
      playerName: "yfnse",
    });
    const res = await client["/portal/reopen-bag"]({
      gameCode: "moonrise",
      playerName: "yfnse",
    });
    expect(res).toEqual({ playerName: "yfnse", gameCode: "moonrise" });
  });

  test("invalid reopenBag", async () => {
    const res = await client["/portal/reopen-bag"]({
      gameCode: "moonrise",
      playerName: "doesnotexistandwillneverexist",
    });
    expect(res).toEqual({ error: "NOT_FOUND" });
  });
});
