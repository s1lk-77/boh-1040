import { endpoint, receive, respond } from "@mit-sdg/sync-engine/boundary";
import { where } from "@mit-sdg/sync-engine/language";
import { concepts } from "../concepts.ts";
import { ABIL_FEATURES, BASE_FEATURES } from "../../shared/constants.ts";

const { Naming, Joining, Inventorying, Cataloging } = concepts;

// generate abils catalog on start
const Start = endpoint("/portal/start", () =>
  receive({}).then(
    where(Cataloging._isCatalog({ name: "abils" }).is({ isCatalog: false }))
      .then(
        Cataloging.catalog({
          name: "abils",
          features: BASE_FEATURES.concat(ABIL_FEATURES).map((f) => f.name),
          default_: "",
        }).responds({ catalog: "abils" }),
      )
      .then(respond({}))
      .named("abilsAdded"),
    where(Cataloging._isCatalog({ name: "abils" }).is({ isCatalog: true }))
      .then(respond({}))
      .named("abilsVerified"),
  ),
);

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
        .then(
          Naming.uniquify({ context: gameCode, suffix: playerName }).responds({
            key: pid,
          }),
        )
        .then(Inventorying.make({ owner: pid }).responds({ owner: pid }))
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
        .then(
          Inventorying.make({ owner: gameCode }).responds({ owner: gameCode }),
        )
        .then(respond({ gameCode }))
        .named("gameCode"),
      where(Joining._isContext({ id: gameCode }).is({ isContext: true }))
        .then(respond({ error: "DUPLICATE_CONTEXT" }))
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

const Name = endpoint(
  "/portal/name",
  ({ gameCode, gameName }) =>
    receive({ gameCode }).then(
      where(Joining._getName({ id: gameCode }).is({ name: gameName }))
        .then(respond({ gameName }))
        .named("foundName"),
    ),
  {
    input: { required: ["gameCode"] },
  },
);

const Validate = endpoint(
  "/portal/validate",
  ({ gameCode }) =>
    receive({ gameCode }).then(
      where(Joining._isContext({ id: gameCode }).is({ isContext: false }))
        .then(respond({ available: true }))
        .named("validatedTrue"),
      where(Joining._isContext({ id: gameCode }).is({ isContext: true }))
        .then(respond({ available: false }))
        .named("validatedFalse"),
    ),
  {
    input: { required: ["gameCode"] },
  },
);

export const portalCmp = {
  Join,
  Rejoin,
  Create,
  Reopen,
  Start,
  Name,
  Validate,
};
