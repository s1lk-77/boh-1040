import { Suspense, lazy, useCallback, useEffect, useRef } from "react";
import { Route, Routes } from "react-router";
import { Box, MantineProvider } from "@mantine/core";
import { type BoHClient, useClient } from "./ClientProvider";

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
      <Box w="100vw" h="100dvh" pos="relative">
        <Routes>
          <Route index element={<HomePage />} />
          <Route path="portal" element={<GMLoginPage />} />
          <Route path="demiplane/:gameCode" element={<GMPage />} />
          <Route path="bag/:bagId" element={<PlayerPage />} />
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
    <MantineProvider>
      <AppContent />
    </MantineProvider>
  );
}

export default App;
