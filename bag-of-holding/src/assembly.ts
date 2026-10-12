import { assemble } from "@mit-sdg/sync-engine/assembly";
import { portalCmp } from "./compositions/Portal.ts";
import { NamingConcept } from "./concepts/Naming.ts";
import { JoiningConcept } from "./concepts/Joining.ts";
import { applicationConceptSet } from "./concepts.ts";
import { db } from "./db.ts";

export function assembleApplication() {
  return assemble({
    conceptSet: applicationConceptSet,
    instances: {
      Naming: new NamingConcept(db),
      Joining: new JoiningConcept(db),
    },
    composition: {},
    rawFaultReporter: ({ error }) => console.error(error),
  });
}
