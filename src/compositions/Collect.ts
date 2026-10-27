import { endpoint, receive, respond } from "@mit-sdg/sync-engine/boundary";
import { where, former, form, each } from "@mit-sdg/sync-engine/language";
import { concepts } from "../concepts.ts";

const { Joining, Naming, Cataloging, Inventorying } = concepts;

const Card = former("the abil card", ({ entry }, { feature, value }) =>
  form({
    card: each(
      Cataloging._get({ catalog: "abils", entry }).is({ feature, value }),
    ).form({ feature, value }),
  }),
);

const Compendium = former(
  "the abil compendium",
  ({ gameCode }, { entry, feature, value }) =>
    form({
      cards: each(
        Inventorying._getAll({ owner: gameCode }).is({ item: entry }),
      ).form({
        card: each(
          Cataloging._get({ catalog: "abils", entry }).is({ feature, value }),
        ).form({ feature, value }),
      }),
    }),
);

const PlayerCompendium = former(
  "the player abil compendium",
  ({ gameCode, pid }, { entry, feature, value }) =>
    form({
      cards: each(Inventorying._getAll({ owner: pid }).is({ item: entry }))
        .where(
          Inventorying._owns({ owner: gameCode, item: entry }).is({
            owns: true,
          }),
        )
        .form({
          card: each(
            Cataloging._get({ catalog: "abils", entry }).is({ feature, value }),
          ).form({ feature, value }),
        }),
    }),
);

/** Very simple playerlist with playername forming */
const PlayerList = former("the playerlist", ({ gameCode }, { playerName }) =>
  each(Joining._getAll({ id: gameCode }).is({ member: playerName })).form({
    playerName,
  }),
);

const ListPlayers = endpoint(
  "/collect/list-players",
  ({ gameCode }) =>
    receive({ gameCode }).then(
      respond({ playerlist: PlayerList({ gameCode }) }),
    ),
  {
    input: { required: ["gameCode"] },
  },
);

const Print = endpoint(
  "/collect/print",
  ({ gameCode, playerName, lookup, pid, entry }) =>
    receive({ gameCode, playerName, lookup }).then(
      where(
        Naming._getKey({ context: gameCode, suffix: playerName }).is({
          key: pid,
        }),
        Naming._getKey({ context: gameCode, suffix: lookup }).is({
          key: entry,
        }),
        Inventorying._owns({ owner: gameCode, item: entry }).is({ owns: true }),
        Inventorying._owns({ owner: pid, item: entry }).is({ owns: false }),
      )
        .then(Inventorying.add({ owner: pid, item: entry }))
        .then(respond({ abil: Card({ entry }) }))
        .named("found"),
      where(
        Naming._getKey({ context: gameCode, suffix: playerName }).is({
          key: null,
        }),
      )
        .then(respond({ error: "DOES_NOT_EXIST", msg: "noPlayer" }))
        .named("noPlayer"),
      where(
        Naming._getKey({ context: gameCode, suffix: lookup }).is({
          key: null,
        }),
      )
        .then(respond({ error: "DOES_NOT_EXIST", msg: "noKey" }))
        .named("noKey"),
      where(
        Naming._getKey({ context: gameCode, suffix: lookup }).is({
          key: entry,
        }),
        Inventorying._owns({ owner: gameCode, item: entry }).is({
          owns: false,
        }),
      )
        .then(respond({ error: "BAD_INVENTORY_OP", msg: "noSuchAbil" }))
        .named("noSuchAbil"),
      where(
        Naming._getKey({ context: gameCode, suffix: lookup }).is({
          key: entry,
        }),
        Naming._getKey({ context: gameCode, suffix: playerName }).is({
          key: pid,
        }),
        Inventorying._owns({ owner: pid, item: entry }).is({
          owns: true,
        }),
      )
        .then(respond({ error: "BAD_INVENTORY_OP", msg: "alreadyFound" }))
        .named("alreadyFound"),
    ),
  {
    input: { required: ["gameCode", "playerName", "lookup"] },
  },
);

const Production = endpoint(
  "/collect/production",
  ({ gameCode, playerName, pid }) =>
    receive({ gameCode, playerName }).then(
      where(
        Naming._getKey({ context: gameCode, suffix: playerName }).is({
          key: pid,
        }),
      )
        .then(respond({ abils: PlayerCompendium({ gameCode, pid }) }))
        .named("collected"),
      where(
        Naming._getKey({ context: gameCode, suffix: playerName }).is({
          key: null,
        }),
      )
        .then(respond({ error: "DOES_NOT_EXIST", msg: "noPlayer" }))
        .named("noPlayer"),
    ),
  {
    input: { required: ["gameCode", "playerName"] },
  },
);

const Admin = endpoint(
  "/collect/admin",
  ({ gameCode }) =>
    receive({ gameCode }).then(
      where(
        Joining._isContext({ id: gameCode }).is({
          isContext: true,
        }),
      )
        .then(respond({ abils: Compendium({ gameCode }) }))
        .named("collected"),
      where(
        Joining._isContext({ id: gameCode }).is({
          isContext: false,
        }),
      )
        .then(respond({ error: "DOES_NOT_EXIST", msg: "gameNotFound" }))
        .named("gameNotFound"),
    ),
  {
    input: { required: ["gameCode"] },
  },
);

export const collectCmp = {
  Card,
  Print,
  Compendium,
  Production,
  Admin,
  PlayerList,
  ListPlayers,
  PlayerCompendium,
};
