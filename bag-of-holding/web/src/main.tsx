import { StrictMode } from "react";
import { BrowserRouter } from "react-router";
import { createRoot } from "react-dom/client";
import { ClientProvider } from "./ClientProvider";

import App from "./App.tsx";

// import "@mantine/core/styles.css";
// import "@mantine/notifications/styles.css";
// import "@mantine/carousel/styles.css";
// import "@mantine/charts/styles.css";
// import "@mantine/dates/styles.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <ClientProvider>
        <App />
      </ClientProvider>
    </BrowserRouter>
  </StrictMode>,
);
