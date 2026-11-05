import { afterEach, describe, expect, it, vi } from "vitest";
import { createLumeClient } from "./lumeClient";

function eventStream(...events: string[]): Response {
  const body = events.map((event) => `data: ${event}\n\n`).join("");
  return new Response(body, { status: 200, headers: { "Content-Type": "text/event-stream" } });
}

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("createLumeClient", () => {
  it("streams the answer and returns its sources", async () => {
    const fetchMock = vi.fn(async (_url: string, _init?: RequestInit) =>
      eventStream(
        JSON.stringify({ choices: [{ delta: { content: "Hello " } }] }),
        JSON.stringify({ choices: [{ delta: { content: "there" } }], sources: [{ title: "Tariff guide 2026" }] }),
        "[DONE]",
      ),
    );
    vi.stubGlobal("fetch", fetchMock);

    const client = createLumeClient({
      apiBase: "https://api.example.test",
      headers: async () => ({ "x-api-key": "test" }),
    });
    let text = "";
    const sources = await client.send([{ role: "user", content: "hi" }], (delta) => {
      text += delta;
    });

    expect(text).toBe("Hello there");
    expect(sources).toEqual([{ title: "Tariff guide 2026" }]);
    const [url, init] = fetchMock.mock.calls[0];
    expect(url).toBe("https://api.example.test/v1/chat/completions");
    expect(init?.headers).toMatchObject({ "x-api-key": "test" });
  });
});
