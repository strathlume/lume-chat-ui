import type { IPublicClientApplication } from "@azure/msal-browser";
import { apiScopes } from "../auth/msal";
import type { LumeEnvironment } from "../config/environments";
import { createDemoClient } from "./demoClient";
import { createLumeClient } from "./lumeClient";
import type { ChatClient } from "./types";

export function createClient(env: LumeEnvironment, msal: IPublicClientApplication | null): ChatClient {
  if (env.auth === "none" || env.apiBase === null) {
    return createDemoClient();
  }
  const apiBase = env.apiBase;

  if (env.auth === "key") {
    // Staging only: the key comes from .env.local on an engineer's machine.
    return createLumeClient({
      apiBase,
      headers: async () => ({ "x-api-key": import.meta.env.VITE_LUME_API_KEY ?? "" }),
    });
  }

  return createLumeClient({
    apiBase,
    headers: async () => {
      if (!msal) throw new Error("Sign-in is not set up");
      const account = msal.getActiveAccount() ?? msal.getAllAccounts()[0];
      if (!account) throw new Error("Not signed in");
      try {
        const result = await msal.acquireTokenSilent({ scopes: apiScopes, account });
        return { Authorization: `Bearer ${result.accessToken}` };
      } catch (error) {
        await msal.acquireTokenRedirect({ scopes: apiScopes, account });
        throw error;
      }
    },
  });
}
