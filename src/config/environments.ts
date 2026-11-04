export type LumeEnvName = "production" | "staging";

export type AuthMode = "entra" | "key";

export interface LumeEnvironment {
  name: LumeEnvName;
  apiBase: string;
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
};

export function resolveEnvironment(value: string | undefined): LumeEnvironment {
  if (value && Object.hasOwn(environments, value)) {
    return environments[value as LumeEnvName];
  }
  return environments.production;
}
