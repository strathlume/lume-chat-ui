import { MsalProvider } from "@azure/msal-react";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { App } from "./App";
import { createMsal } from "./auth/msal";
import { resolveEnvironment } from "./config/environments";
import "./styles.css";

async function start() {
  const env = resolveEnvironment(import.meta.env.VITE_LUME_ENV);
  const root = createRoot(document.getElementById("root")!);

  if (env.auth === "entra") {
    const msal = await createMsal();
    root.render(
      <StrictMode>
        <MsalProvider instance={msal}>
          <App env={env} msal={msal} />
        </MsalProvider>
      </StrictMode>,
    );
    return;
  }

  root.render(
    <StrictMode>
      <App env={env} msal={null} />
    </StrictMode>,
  );
}

void start();
