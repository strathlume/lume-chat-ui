import { takeEvents } from "./sse";
import type { ChatClient, ChatMessage } from "./types";

export interface LumeClientOptions {
  apiBase: string;
  headers: () => Promise<Record<string, string>>;
}

interface CompletionChunk {
  choices?: { delta?: { content?: string } }[];
}

/** Streams answers from the LUME API (OpenAI-compatible chat completions). */
export function createLumeClient({ apiBase, headers }: LumeClientOptions): ChatClient {
  return {
    async send(history: ChatMessage[], onDelta: (text: string) => void, signal?: AbortSignal) {
      const response = await fetch(`${apiBase}/v1/chat/completions`, {
        method: "POST",
        headers: { "Content-Type": "application/json", ...(await headers()) },
        body: JSON.stringify({
          model: "lume",
          stream: true,
          messages: history.map(({ role, content }) => ({ role, content })),
        }),
        signal,
      });
      if (!response.ok || !response.body) {
        throw new Error(`LUME API answered ${response.status}`);
      }

      const reader = response.body.pipeThrough(new TextDecoderStream()).getReader();
      let buffer = "";
      for (;;) {
        const { value, done } = await reader.read();
        if (done) return;
        buffer += value;
        const { events, rest } = takeEvents(buffer);
        buffer = rest;
        for (const data of events) {
          if (data === "[DONE]") return;
          const chunk = JSON.parse(data) as CompletionChunk;
          const text = chunk.choices?.[0]?.delta?.content;
          if (text) onDelta(text);
        }
      }
    },
  };
}
