import { createContext, useContext, type ReactNode } from "react";
import {
  createHttpClient,
  type HttpClientError,
} from "@mit-sdg/sync-engine-http/client";
import type { BoHWireHttp } from "../../generated/wire.ts";
import { type Client } from "@mit-sdg/sync-engine/client";

// create context
export type BoHClient = Client<BoHWireHttp, HttpClientError>;
const ClientContext = createContext<BoHClient | null>(null);

// context provider
/**
 * Provides the client context for BoH
 * @param children the rest of the app
 * @returns the client context provider
 */
export function ClientProvider({ children }: { children: ReactNode }) {
  const client: BoHClient = createHttpClient<BoHWireHttp>({ baseUrl: "/api" });

  return (
    <ClientContext.Provider value={client}>{children}</ClientContext.Provider>
  );
}

/**
 * Custom hook for the client context
 * @returns the client context
 */
export const useClient = () => useContext(ClientContext);
