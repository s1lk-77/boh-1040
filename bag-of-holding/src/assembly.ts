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

export function assembleApplication() {
  return assemble({
    conceptSet: applicationConceptSet,
    instances: {
      Naming: new NamingConcept(db),
      Joining: new JoiningConcept(db),
      Inventorying: new InventoryingConcept(db),
      Cataloging: new CatalogingConcept(db),
    },
    composition: { Portal: portalCmp, Edit: editCmp, Collect: collectCmp },
    rawFaultReporter: ({ error }) => console.error(error),
  });
}
