import { createHttpClient } from "@mit-sdg/sync-engine-http/client";
import type { BoHWireHttp } from "../generated/wire.ts";

/**
 * This script simulates a client and tests the functionality of endpoints in node, without needing a frontend.
 */
const client = createHttpClient<BoHWireHttp>({
  baseUrl: "http://127.0.0.1:3000/api",
});

/* ********** Portal Endpoints ********** **/

/**
 * Tests /api/portal/create-game
 *
 * @param gameCode
 * @returns a promise of the http response
 */
const createGame = async (gameCode: string): Promise<void> => {
  const res = await client["/portal/create-game"]({
    gameCode,
    gameName: "placeholder",
  });
  console.log(res);
  return;
};

/**
 * Tests /api/portal/create-game
 *
 * @param gameCode
 * @returns a promise of the http response
 */
const openBag = async (gameCode: string, playerName: string): Promise<void> => {
  const res = await client["/portal/open-bag"]({
    gameCode,
    playerName,
  });
  console.log(res);
  return;
};

/**
 * Tests /api/portal/create-game
 *
 * @param gameCode
 * @returns a promise of the http response
 */
const reopenBag = async (
  gameCode: string,
  playerName: string,
): Promise<void> => {
  const res = await client["/portal/reopen-bag"]({
    gameCode,
    playerName,
  });
  console.log(res);
  return;
};

/**
 * Tests /api/portal/create-game
 *
 * @param gameCode
 * @returns a promise of the http response
 */
const reopenGame = async (gameCode: string): Promise<void> => {
  const res = await client["/portal/reopen-game"]({
    gameCode,
  });
  console.log(res);
  return;
};

// PORTAL ENDPOINT TESTS
const gameCode = "test1";
const playerName = "testPlayer1";
reopenGame(gameCode);
