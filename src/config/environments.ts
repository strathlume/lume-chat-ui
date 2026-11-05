export type LumeEnvName = "production" | "staging" | "demo";

export type AuthMode = "entra" | "key" | "none";

export interface LumeEnvironment {
  name: LumeEnvName;
  /** null: no backend, canned answers. */
  apiBase: string | null;
  auth: AuthMode;
}

export const environments: Record<LumeEnvName, LumeEnvironment> = {
  production: {
    name: "production",
    apiBase: "https://api.strathlume.com",
    auth: "entra",
  },
  staging: {
    name: "staging",
    apiBase: "https://api-staging.strathlume.com",
    auth: "key",
  },
  demo: {
    name: "demo",
    apiBase: null,
    auth: "none",
  },
};

export function resolveEnvironment(value: string | undefined): LumeEnvironment {
  if (value && Object.hasOwn(environments, value)) {
    return environments[value as LumeEnvName];
  }
  return environments.production;
}
