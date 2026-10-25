import { StrictMode } from "react";
import { HashRouter } from "react-router";
import { createRoot } from "react-dom/client";
import { ClientProvider } from "./ClientProvider";

import App from "./App.tsx";

import "@mantine/core/styles.css";
import "../styles.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <HashRouter>
      <ClientProvider>
        <App />
      </ClientProvider>
    </HashRouter>
  </StrictMode>,
);
