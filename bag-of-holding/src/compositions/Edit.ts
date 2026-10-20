import { endpoint, receive, respond } from "@mit-sdg/sync-engine/boundary";
import { where } from "@mit-sdg/sync-engine/language";
import { concepts } from "../concepts.ts";

const { Naming, Cataloging, Inventorying, Joining } = concepts;

// endpoint for adding ability entry, assumes the abilities catalog exists
const AddEntry = endpoint(
  "/edit/add-entry",
  ({ gameCode, lookup, entry }) =>
    receive({ gameCode, lookup }).then(
      where(
        Naming._getKey({ context: gameCode, suffix: lookup }).is({ key: null }),
      )
        .then(
          Naming.uniquify({ context: gameCode, suffix: lookup }).responds({
            key: entry,
          }),
        )
        .then(
          Cataloging.addEntry({ catalog: "abils", entry }).responds({ entry }),
        )
        .then(
          Inventorying.add({ owner: gameCode, item: entry }).responds({
            item: entry,
          }),
        )
        .then(respond({ gameCode, lookup }))
        .named("entryAdded"),
      where(Naming._getKey({ context: gameCode, suffix: lookup }))
        .then(respond({ error: "ALREADY_EXISTS" }))
        .named("refused"),
    ),
  {
    input: { required: ["gameCode", "lookup"] },
  },
);

// endpoint for updating ability entry, assumes the abilities catalog exists
const UpdateEntry = endpoint(
  "/edit/update-entry",
  ({ gameCode, lookup, feature, value, entry }) =>
    receive({ gameCode, lookup, feature, value }).then(
      where(
        Naming._getKey({ context: gameCode, suffix: lookup }).is({
          key: entry,
        }),
        Inventorying._owns({ owner: gameCode, item: entry }).is({ owns: true }),
      )
        .then(
          Cataloging.update({
            catalog: "abils",
            entry,
            feature,
            value,
          }).responds({ entry }),
        )
        .then(respond({ entry }))
        .named("entryUpdated"),
      where(
        Naming._getKey({ context: gameCode, suffix: lookup }).is({ key: null }),
      )
        .then(respond({ error: "DOES_NOT_EXIST" }))
        .named("refused"),
    ),
  {
    input: { required: ["gameCode", "lookup", "feature", "value"] },
  },
);

// endpoint for updating game name
const UpdateName = endpoint(
  "/edit/update-name",
  ({ gameCode, gameName }) =>
    receive({ gameCode, gameName }).then(
      where(
        Joining._isContext({ id: gameCode }).is({
          isContext: true,
        }),
      )
        .then(
          Joining.updateName({ id: gameCode, name: gameName }).responds({
            name: gameName,
          }),
        )
        .then(respond({ gameName }))
        .named("gameNameUpdated"),
      where(
        Joining._isContext({ id: gameCode }).is({
          isContext: false,
        }),
      )
        .then(respond({ error: "NO_SUCH_CONTEXT" }))
        .named("refused"),
    ),
  {
    input: { required: ["gameCode", "gameName"] },
  },
);

// endpoint for deleting an entry
const DeleteEntry = endpoint(
  "/edit/delete-entry",
  ({ gameCode, lookup, entry }) =>
    receive({ gameCode, lookup }).then(
      where(
        Naming._getKey({ context: gameCode, suffix: lookup }).is({
          key: entry,
        }),
        Cataloging._exists({ catalog: "abils", entry }).is({
          exists: true,
        }),
      )
        .then(
          Cataloging.delete({ catalog: "abils", entry }).responds({ entry }),
        )
        .then(
          Inventorying.remove({ owner: gameCode, item: entry }).responds({
            item: entry,
          }),
        )
        .then(
          Naming.delete({ key: entry }).responds({
            key: entry,
          }),
        )
        .then(respond({ entry }))
        .named("entryDelete"),
      where(
        Naming._getKey({ context: gameCode, suffix: lookup }).is({ key: null }),
      )
        .then(respond({ error: "DOES_NOT_EXIST" }))
        .named("refused"),
    ),
  {
    input: { required: ["gameCode", "lookup"] },
  },
);

export const editCmp = { AddEntry, UpdateEntry, UpdateName, DeleteEntry };
