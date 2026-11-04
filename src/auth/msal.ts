import { PublicClientApplication } from "@azure/msal-browser";

const tenantId = import.meta.env.VITE_ENTRA_TENANT_ID ?? "";
const clientId = import.meta.env.VITE_ENTRA_CLIENT_ID ?? "";
const apiScope = import.meta.env.VITE_ENTRA_API_SCOPE;

export const apiScopes: string[] = apiScope ? [apiScope] : [];

export async function createMsal(): Promise<PublicClientApplication> {
  const msal = new PublicClientApplication({
    auth: {
      clientId,
      authority: `https://login.microsoftonline.com/${tenantId}`,
      redirectUri: window.location.origin,
    },
    cache: { cacheLocation: "sessionStorage" },
  });
  await msal.initialize();
  const result = await msal.handleRedirectPromise();
  if (result?.account) msal.setActiveAccount(result.account);
  return msal;
}
