import { assemble } from "@mit-sdg/sync-engine/assembly";
import { portalCmp } from "./compositions/Portal";
import { editCmp } from "./compositions/Edit";
import { collectCmp } from "./compositions/Collect";
import { NamingConcept } from "./concepts/Naming";
import { JoiningConcept } from "./concepts/Joining";
import { InventoryingConcept } from "./concepts/Inventorying";
import { CatalogingConcept } from "./concepts/Cataloging";
import { applicationConceptSet } from "./concepts";
import { db } from "./db";
import { type Db } from "mongodb";

export function assembleApplication(database: Db = db) {
  return assemble({
    conceptSet: applicationConceptSet,
    instances: {
      Naming: new NamingConcept(database),
      Joining: new JoiningConcept(database),
      Inventorying: new InventoryingConcept(database),
      Cataloging: new CatalogingConcept(database),
    },
    composition: { Portal: portalCmp, Edit: editCmp, Collect: collectCmp },
    rawFaultReporter: ({ error }) => console.error(error),
  });
}
