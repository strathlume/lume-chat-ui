import { describe, expect, it } from "vitest";
import { takeEvents } from "./sse";

describe("takeEvents", () => {
  it("returns complete events and keeps the rest", () => {
    const { events, rest } = takeEvents('data: {"a":1}\n\ndata: [DONE]\n\ndata: {"b"');
    expect(events).toEqual(['{"a":1}', "[DONE]"]);
    expect(rest).toBe('data: {"b"');
  });

  it("handles CRLF line endings", () => {
    expect(takeEvents("data: x\r\n\r\n").events).toEqual(["x"]);
  });
});
