import { Suspense, lazy } from "react";
import { Route, Routes } from "react-router";
import { Box, MantineProvider } from "@mantine/core";
// import { Box, MantineProvider } from '@mantine/core';
// import { DatesProvider } from '@mantine/dates';
// import { ModalsProvider } from '@mantine/modals';
// import { Notifications } from '@mantine/notifications';

// import ErrorBoundary from './ErrorBoundary';
// import { LoadingScreen } from './components';
// import { contextModals, theme } from './mantine';

// import './App.css';

const HomePage = lazy(() => import("./pages/HomePage"));
const GMLoginPage = lazy(() => import("./pages/GMLoginPage"));
const GMPage = lazy(() => import("./pages/GMPage"));
const PlayerPage = lazy(() => import("./pages/PlayerPage"));

/**
 * The main application content component that handles routing and renders the appropriate page component.
 */
function AppContent() {
  return (
    <Suspense fallback={<div></div>}>
      <Box w="100vw" h="100dvh" pos="relative">
        <Routes>
          <Route index element={<HomePage />} />
          <Route path="portal" element={<GMLoginPage />} />
          <Route path="demiplane" element={<GMPage />} />
          <Route path="bag" element={<PlayerPage />} />
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
