import { describe, expect, it } from "vitest";
import { environments, resolveEnvironment } from "./environments";

describe("resolveEnvironment", () => {
  it("defaults to production", () => {
    expect(resolveEnvironment(undefined)).toBe(environments.production);
  });

  it("picks staging by name", () => {
    expect(resolveEnvironment("staging").apiBase).toBe("https://api-staging.strathlume.com");
  });

  it("runs the demo without a backend", () => {
    expect(resolveEnvironment("demo")).toMatchObject({ apiBase: null, auth: "none" });
  });

  it("gives every environment an MCP address", () => {
    for (const env of Object.values(environments)) {
      expect(env.mcpUrl).toMatch(/^https:\/\/mcp(-staging)?\.strathlume\.com\/mcp$/);
    }
  });

  it("ignores unknown and inherited names", () => {
    expect(resolveEnvironment("prod")).toBe(environments.production);
    expect(resolveEnvironment("toString")).toBe(environments.production);
  });
});
