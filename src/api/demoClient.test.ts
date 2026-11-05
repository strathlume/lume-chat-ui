import { describe, expect, it } from "vitest";
import { createDemoClient, pickAnswer } from "./demoClient";

describe("demo client", () => {
  it("matches a tariff question", () => {
    expect(pickAnswer("What is the Highland tariff?").answer).toContain("tariff");
  });

  it("falls back for anything else", () => {
    expect(pickAnswer("hello").answer).toContain("public demo");
  });

  it("streams the whole answer and returns its sources", async () => {
    let text = "";
    const sources = await createDemoClient(0).send([{ role: "user", content: "inverter fault" }], (delta) => {
      text += delta;
    });
    expect(text).toBe(pickAnswer("inverter fault").answer);
    expect(sources).toEqual([{ title: "Field runbook FR-112: inverter fault reset" }]);
  });
});
