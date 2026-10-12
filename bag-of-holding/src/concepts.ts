import { conceptSet, registerConcept } from "@mit-sdg/sync-engine/assembly";
import joiningSpecs from "@design/concepts/Joining.md" with { type: "text" };
import namingSpecs from "@design/concepts/Naming.md" with { type: "text" };
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

export const applicationConceptSet = conceptSet({
  Joining: joining,
  Naming: naming,
});
export const { concepts } = applicationConceptSet;
