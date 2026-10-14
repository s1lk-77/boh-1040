import { endpoint, receive, respond } from "@mit-sdg/sync-engine/boundary";
import { where, former, form, each } from "@mit-sdg/sync-engine/language";
import { concepts } from "../concepts.ts";

const { Naming, Cataloging, Inventorying } = concepts;

const Card = former("the abil card", ({ entry }, { feature, value }) =>
  form({
    card: each(
      Cataloging._get({ catalog: "abils", entry }).is({ feature, value }),
    ).form({ feature, value }),
  }),
);

const Compendium = former(
  "the abil compendium",
  ({ pid }, { entry, feature, value }) =>
    form({
      cards: each(
        Inventorying._getAll({ owner: pid }).is({ item: entry }),
      ).form({
        card: each(
          Cataloging._get({ catalog: "abils", entry }).is({ feature, value }),
        ).form({ feature, value }),
      }),
    }),
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
        .then(respond({ abils: Compendium({ pid }) }))
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

export const collectCmp = { Card, Print, Compendium, Production };
