import { Suspense, lazy, useCallback, useEffect, useRef } from "react";
import { Route, Routes } from "react-router";
import {
  Box,
  MantineProvider,
  createTheme,
  type CSSVariablesResolver,
} from "@mantine/core";
import { type BoHClient, useClient } from "./ClientProvider";

export const theme = createTheme({
  /* Put your mantine theme override here */
});

// Create a resolver that overrides --mantine-color-text in light & dark modes
export const cssVarResolver: CSSVariablesResolver = () => ({
  /** Shared CSS variables that should be accessible independent from color scheme */
  variables: {},
  /** CSS variables available only in dark color scheme */
  light: {
    "--mantine-color-text": "#000000",
  },
  /** CSS variables available only in light color scheme */
  dark: {
    "--mantine-color-text": "#FFFFFF",
  },
});

const HomePage = lazy(() => import("./pages/HomePage"));
const GMLoginPage = lazy(() => import("./pages/GMLoginPage"));
const GMPage = lazy(() => import("./pages/GMPage"));
const PlayerPage = lazy(() => import("./pages/PlayerPage"));

/**
 * The main application content component that handles routing and renders the appropriate page component.
 */
function AppContent() {
  // call the application start endpoint
  const startedRef = useRef<boolean>(false);
  const client = useClient();

  const start = useCallback(async (client: BoHClient) => {
    await client["/portal/start"]({});
    startedRef.current = true;
    console.log("Demiplane located");
  }, []);

  useEffect(() => {
    if (client === null || startedRef.current) return;
    start(client);
  }, [client]);

  return (
    <Suspense fallback={<div></div>}>
      <Box w="100vw" h="100dvh" pos="relative" bg="red.8">
        <Routes>
          <Route index element={<HomePage />} />
          <Route path="/portal" element={<GMLoginPage />} />
          <Route path="/demiplane/:gameCode" element={<GMPage />} />
          <Route path="/bag/:bagId" element={<PlayerPage />} />
        </Routes>
      </Box>
    </Suspense>
  );
}

/**
 * The root App component that provides all necessary context providers for the application.
 */
function App() {
  return (
    <MantineProvider theme={theme} cssVariablesResolver={cssVarResolver}>
      <AppContent />
    </MantineProvider>
  );
}

export default App;
