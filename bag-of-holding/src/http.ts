import { httpPolicy } from "@mit-sdg/sync-engine-http/policy";

export const policy = httpPolicy({
  basePath: "/api",
  publicErrors: {
    DOES_NOT_EXIST: "NOT_FOUND",
    DUPLICATE_MEMBER: "CONFLICT",
    DUPLICATE_CONTEXT: "CONFLICT",
    ALREADY_EXISTS: "CONFLICT",
    NO_SUCH_CONTEXT: "NOT_FOUND",
  },
});
