/** Splits a server-sent events buffer into complete `data` payloads and the unfinished rest. */
export function takeEvents(buffer: string): { events: string[]; rest: string } {
  const blocks = buffer.replace(/\r\n/g, "\n").split("\n\n");
  const rest = blocks.pop() ?? "";
  const events: string[] = [];
  for (const block of blocks) {
    const data = block
      .split("\n")
      .filter((line) => line.startsWith("data:"))
      .map((line) => line.slice(5).trimStart())
      .join("\n");
    if (data) events.push(data);
  }
  return { events, rest };
}
