import { endpoint, receive, respond } from "@mit-sdg/sync-engine/boundary";
import {
  each,
  form,
  former,
  where,
  no,
  is,
} from "@mit-sdg/sync-engine/language";
import { concepts } from "../concepts.ts";

const { Naming, Joining } = concepts;

// endpoint for player joining a game
const Join = endpoint(
  "/portal/open-bag",
  ({ gameCode, playerName, pid }) =>
    receive({ gameCode, playerName }).then(
      where(
        Joining._isContext({ id: gameCode }).is({ isContext: true }),
        Joining._isMember({ id: gameCode, member: playerName }).is({
          isMember: false,
        }),
      )
        .then(Joining.join({ id: gameCode, member: playerName }))
        .then(Naming.uniquify({ context: gameCode, suffix: playerName }))
        .then(respond({ gameCode, playerName }))
        .named("openedBag"),
      where(Joining._isContext({ id: gameCode }).is({ isContext: false }))
        .then(respond({ error: "NO_SUCH_CONTEXT" }))
        .named("gameNotFound"),
      where(
        Joining._isMember({ id: gameCode, member: playerName }).is({
          isMember: true,
        }),
      )
        .then(respond({ error: "DUPLICATE_MEMBER" }))
        .named("playerAlreadyExists"),
    ),
  {
    input: { required: ["gameCode", "playerName"] },
  },
);

// endpoint for player rejoining a game
const Rejoin = endpoint(
  "/portal/reopen-bag",
  ({ gameCode, playerName }) =>
    receive({ gameCode, playerName }).then(
      where(
        Joining._isContext({ id: gameCode }).is({ isContext: true }),
        Joining._isMember({ id: gameCode, member: playerName }).is({
          isMember: true,
        }),
      )
        .then(respond({ gameCode, playerName }))
        .named("reopenBag"),
      where(Joining._isContext({ id: gameCode }).is({ isContext: false }))
        .then(respond({ error: "NO_SUCH_CONTEXT" }))
        .named("gameNotFound"),
      where(
        Joining._isMember({ id: gameCode, member: playerName }).is({
          isMember: false,
        }),
      )
        .then(respond({ error: "DOES_NOT_EXIST" }))
        .named("playerNotFound"),
    ),
  {
    input: { required: ["gameCode", "playerName"] },
  },
);

// endpoint for GM creating a game
const Create = endpoint(
  "/portal/create-game",
  ({ gameCode, gameName }) =>
    receive({ gameCode, gameName }).then(
      where(Joining._isContext({ id: gameCode }).is({ isContext: false }))
        .then(
          Joining.create({
            id: gameCode,
            name: gameName,
          }),
        )
        .then(respond({ gameCode }))
        .named("gameCode"),
      where(Joining._isContext({ id: gameCode }).is({ isContext: true }))
        .then(respond({ error: "DUPLICATE_KEY" }))
        .named("refused"),
    ),
  {
    input: { required: ["gameCode", "gameName"] }, // how do I do an optional key?
  },
);

// endpoint for GM reopening a game
const Reopen = endpoint(
  "/portal/reopen-game",
  ({ gameCode }) =>
    receive({ gameCode }).then(
      where(Joining._isContext({ id: gameCode }).is({ isContext: true }))
        .then(respond({ gameCode }))
        .named("gameCode"),
      where(Joining._isContext({ id: gameCode }).is({ isContext: false }))
        .then(respond({ error: "NO_SUCH_CONTEXT" }))
        .named("refused"),
    ),
  {
    input: { required: ["gameCode"] },
  },
);

export const portalCmp = { Join, Rejoin, Create, Reopen };
