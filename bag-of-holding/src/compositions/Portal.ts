import { endpoint, receive, respond } from "@mit-sdg/sync-engine/boundary";
import { each, form, former, where, no } from "@mit-sdg/sync-engine/language";
import { concepts } from "../concepts.ts";

const { Naming, Joining } = concepts;

// endpoint for player joining a game
const Join = endpoint(
  "/portal/open-bag",
  ({ gameCode, playerName, pid }) =>
    receive({ gameCode, playerName }).then(
      where(
        Joining._isContext({ id: gameCode }),
        no(Naming._getKey({ context: gameCode, suffix: playerName })),
      )
        .then(
          Naming.uniquify({ context: gameCode, suffix: playerName }).responds({
            pid,
          }),
        )
        .then(Joining.join({ id: gameCode, member: pid }))
        .then(respond({ gameCode, playerName }))
        .named("openBag"),
      where()
        .then(respond({ error: "NO_SUCH_CONTEXT" }))
        .named("refused"),
      where()
        .then(respond({ error: "DUPLICATE_MEMBER" }))
        .named("refused"),
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
        Joining._isContext({ id: gameCode }),
        Naming._getKey({ context: gameCode, suffix: playerName }),
      )
        .then(respond({ gameCode, playerName }))
        .named("reopenBag"),
      where(no(Joining._isContext({ id: gameCode })))
        .then(respond({ error: "NO_SUCH_CONTEXT" }))
        .named("refused"),
      where(no(Naming._getKey({ context: gameCode, suffix: playerName })))
        .then(respond({ error: "DOES_NOT_EXIST" }))
        .named("refused"),
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
      where(no(Joining._isContext({ id: gameCode })))
        .then(
          Joining.create({
            id: gameCode,
            name: gameName ?? gameCode,
          }).responds({}),
        )
        .then(respond({ gameCode }))
        .named("gameCode"),
      where(Joining._isContext({ id: gameCode }))
        .then(respond({ error: "DUPLICATE_KEY" }))
        .named("refused"),
    ),
  {
    input: { required: ["gameCode"] },
  },
);

// endpoint for GM reopening a game
const Reopen = endpoint(
  "/portal/reopen-game",
  ({ gameCode }) =>
    receive({ gameCode }).then(
      where(Joining._isContext({ id: gameCode }))
        .then(respond({ gameCode }))
        .named("gameCode"),
      where(no(Joining._isContext({ id: gameCode })))
        .then(respond({ error: "NO_SUCH_CONTEXT" }))
        .named("refused"),
    ),
  {
    input: { required: ["gameCode"] },
  },
);
