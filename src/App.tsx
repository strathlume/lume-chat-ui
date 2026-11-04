import type { IPublicClientApplication } from "@azure/msal-browser";
import { AuthenticatedTemplate, UnauthenticatedTemplate } from "@azure/msal-react";
import { useMemo } from "react";
import { createClient } from "./api/createClient";
import { apiScopes } from "./auth/msal";
import { ChatWindow } from "./components/ChatWindow";
import { SignIn } from "./components/SignIn";
import type { LumeEnvironment } from "./config/environments";
import { copy } from "./copy";

interface AppProps {
  env: LumeEnvironment;
  msal: IPublicClientApplication | null;
}

export function App({ env, msal }: AppProps) {
  const client = useMemo(() => createClient(env, msal), [env, msal]);
  const chat = <ChatWindow client={client} />;

  return (
    <div className="app">
      <header className="app-header">
        <span className="brand">LUME</span>
        {env.name !== "production" && <span className="env-badge">{env.name}</span>}
      </header>
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
