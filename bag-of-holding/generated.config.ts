import { assembleApplication } from "./src/assembly.ts";
import { policy } from "./src/http.ts";
import { httpWire } from "@mit-sdg/sync-engine-http/tooling";

export default {
  assemble: assembleApplication,
  title: "BagOfHolding",
  wireName: "BoHWire",
  design: {
    version: 1,
    documents: [
      new URL("./design/types.md", import.meta.url),
      new URL("./design/compositions/Portal.md", import.meta.url),
    ],
  },
  projections: [httpWire({ policy, name: "BoHWireHttp" })],
};
