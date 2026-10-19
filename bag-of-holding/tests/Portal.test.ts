/** Tests for the Portal endpoints */
import { describe, test, expect } from "bun:test";
import "./api-setup"; // Triggers our database lifecycles
import { client } from "./api-setup";

/* ******* TESTS ********* */

describe("start", () => {
  test("called on start", async () => {
    const res = await client["/portal/start"]({});
    expect(res).toEqual({});
  });
});

describe("createGame", () => {
  test("valid createGame, followed by invalid create game", async () => {
    const res1 = await client["/portal/create-game"]({
      gameCode: "moonrise",
      gameName: "Moonrise",
    });
    expect(res1).toEqual({ gameCode: "moonrise" });
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
    await client["/portal/create-game"]({
      gameCode: "moonrise",
      gameName: "Moonrise",
    });
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

  test("invalid reopenBag because game does not exist", async () => {
    const res = await client["/portal/reopen-bag"]({
      gameCode: "doesnotexistandwillneverexist",
      playerName: "silvanus",
    });
    expect(res).toEqual({ error: "NOT_FOUND" });
  });

  test("invalid reopenBag because player name does not exist", async () => {
    await client["/portal/create-game"]({
      gameCode: "moonrise",
      gameName: "Moonrise",
    });
    const res = await client["/portal/reopen-bag"]({
      gameCode: "moonrise",
      playerName: "doesnotexistandwillneverexist",
    });
    expect(res).toEqual({ error: "NOT_FOUND" });
  });
});

describe("name", () => {
  test("name should get valid gameName", async () => {
    await client["/portal/create-game"]({
      gameCode: "moonrise",
      gameName: "Moonrise",
    });
    const res = await client["/portal/name"]({
      gameCode: "moonrise",
    });
    expect(res).toEqual({ gameName: "Moonrise" });
  });

  test("nonexistent game", async () => {
    const res = await client["/portal/name"]({
      gameCode: "doesnotexistandwillneverexist",
    });
    expect(res).toEqual({ gameName: null });
  });
});
