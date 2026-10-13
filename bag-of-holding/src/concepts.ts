import { conceptSet, registerConcept } from "@mit-sdg/sync-engine/assembly";
import joiningSpecs from "@design/concepts/Joining.md" with { type: "text" };
import namingSpecs from "@design/concepts/Naming.md" with { type: "text" };
import inventoryingSpecs from "@design/concepts/Inventorying.md" with { type: "text" };
import catalogingSpecs from "@design/concepts/Cataloging.md" with { type: "text" };
import {
  DuplicateContext,
  DuplicateMember,
  NoSuchContext,
  JoiningConcept,
} from "./concepts/Joining.ts";
import {
  AlreadyExists,
  DoesNotExist,
  NamingConcept,
} from "./concepts/Naming.ts";
import {
  InventoryingConcept,
  BadInventoryOperation,
} from "./concepts/Inventorying.ts";
import {
  CatalogingConcept,
  BadCatalogOperation,
} from "./concepts/Cataloging.ts";

const joining = registerConcept({
  class: JoiningConcept,
  spec: joiningSpecs,
  refusals: {
    NO_SUCH_CONTEXT: NoSuchContext,
    DUPLICATE_CONTEXT: DuplicateContext,
    DUPLICATE_MEMBER: DuplicateMember,
  },
});

const naming = registerConcept({
  class: NamingConcept,
  spec: namingSpecs,
  refusals: {
    ALREADY_EXISTS: AlreadyExists,
    DOES_NOT_EXIST: DoesNotExist,
  },
});

const inventorying = registerConcept({
  class: InventoryingConcept,
  spec: inventoryingSpecs,
  refusals: {
    BAD_INVENTORY_OP: BadInventoryOperation,
  },
});

const cataloging = registerConcept({
  class: CatalogingConcept,
  spec: catalogingSpecs,
  refusals: {
    BAD_CATALOG_OP: BadCatalogOperation,
  },
});

export const applicationConceptSet = conceptSet({
  Joining: joining,
  Naming: naming,
  Inventorying: inventorying,
  Cataloging: cataloging,
});
export const { concepts } = applicationConceptSet;
