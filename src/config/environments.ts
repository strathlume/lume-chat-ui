export type LumeEnvName = "production" | "staging" | "demo";

export type AuthMode = "entra" | "key" | "none";

export interface LumeEnvironment {
  name: LumeEnvName;
  /** null: no backend, canned answers. */
  apiBase: string | null;
  auth: AuthMode;
  /** LUME's MCP server, for staff who connect their own AI tools. */
  mcpUrl: string;
}

export const environments: Record<LumeEnvName, LumeEnvironment> = {
  production: {
    name: "production",
    apiBase: "https://api.strathlume.com",
    auth: "entra",
    mcpUrl: "https://mcp.strathlume.com/mcp",
  },
  staging: {
    name: "staging",
    apiBase: "https://api-staging.strathlume.com",
    auth: "key",
    mcpUrl: "https://mcp-staging.strathlume.com/mcp",
  },
  demo: {
    name: "demo",
    apiBase: null,
    auth: "none",
    // The demo shows staff the production address.
    mcpUrl: "https://mcp.strathlume.com/mcp",
  },
};

export function resolveEnvironment(value: string | undefined): LumeEnvironment {
  if (value && Object.hasOwn(environments, value)) {
    return environments[value as LumeEnvName];
  }
  return environments.production;
}
