import type { IPublicClientApplication } from "@azure/msal-browser";
import { AuthenticatedTemplate, UnauthenticatedTemplate } from "@azure/msal-react";
import { useMemo, useState } from "react";
import { createClient } from "./api/createClient";
import { apiScopes } from "./auth/msal";
import { ChatWindow } from "./components/ChatWindow";
import { SignIn } from "./components/SignIn";
import { ToolsPanel } from "./components/ToolsPanel";
import type { LumeEnvironment } from "./config/environments";
import { copy } from "./copy";

interface AppProps {
  env: LumeEnvironment;
  msal: IPublicClientApplication | null;
}

export function App({ env, msal }: AppProps) {
  const client = useMemo(() => createClient(env, msal), [env, msal]);
  const [toolsOpen, setToolsOpen] = useState(false);
  const chat = <ChatWindow client={client} />;

  return (
    <div className="app">
      <header className="app-header">
        <span className="brand">LUME</span>
        {env.name !== "production" && <span className="env-badge">{env.name}</span>}
        <button type="button" className="header-button" onClick={() => setToolsOpen((open) => !open)}>
          {copy.toolsButton}
        </button>
      </header>
      {env.name === "demo" && <p className="demo-banner">{copy.demoBanner}</p>}
      {toolsOpen && <ToolsPanel mcpUrl={env.mcpUrl} onClose={() => setToolsOpen(false)} />}
      <main className="app-main">
        {env.auth === "entra" ? (
          <>
            <AuthenticatedTemplate>{chat}</AuthenticatedTemplate>
            <UnauthenticatedTemplate>
              <SignIn onSignIn={() => void msal?.loginRedirect({ scopes: apiScopes })} />
            </UnauthenticatedTemplate>
          </>
        ) : (
          chat
        )}
      </main>
      <footer className="app-footer">{copy.footer}</footer>
    </div>
  );
}
