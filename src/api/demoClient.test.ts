import { describe, expect, it } from "vitest";
import { createDemoClient, pickAnswer } from "./demoClient";

describe("demo client", () => {
  it("matches a tariff question", () => {
    expect(pickAnswer("What is the Highland tariff?")).toContain("tariff");
  });

  it("falls back for anything else", () => {
    expect(pickAnswer("hello")).toContain("public demo");
  });

  it("streams the whole answer", async () => {
    let text = "";
    await createDemoClient(0).send([{ role: "user", content: "inverter fault" }], (delta) => {
      text += delta;
    });
    expect(text).toBe(pickAnswer("inverter fault"));
  });
});
