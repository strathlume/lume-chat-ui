import { useCallback, useRef, useState } from "react";
import type { ChatClient, ChatMessage } from "../api/types";
import { copy } from "../copy";
import { Composer } from "./Composer";
import { MessageList } from "./MessageList";

export function ChatWindow({ client }: { client: ChatClient }) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [busy, setBusy] = useState(false);
  const [failed, setFailed] = useState(false);
  const abort = useRef<AbortController | null>(null);

  const send = useCallback(
    async (text: string) => {
      const history: ChatMessage[] = [...messages, { role: "user", content: text }];
      setMessages([...history, { role: "assistant", content: "" }]);
      setBusy(true);
      setFailed(false);
      const controller = new AbortController();
      abort.current = controller;

      const append = (delta: string) =>
        setMessages((current) => {
          const next = current.slice();
          const last = next[next.length - 1];
          next[next.length - 1] = { ...last, content: last.content + delta };
          return next;
        });

      try {
        const sources = await client.send(history, append, controller.signal);
        if (sources.length > 0) {
          setMessages((current) => {
            const next = current.slice();
            next[next.length - 1] = { ...next[next.length - 1], sources };
            return next;
          });
        }
      } catch {
        if (!controller.signal.aborted) setFailed(true);
      } finally {
        setBusy(false);
      }
    },
    [client, messages],
  );

  return (
    <section className="chat">
      {messages.length === 0 ? (
        <p className="chat-empty">{copy.emptyState}</p>
      ) : (
        <MessageList messages={messages} busy={busy} />
      )}
      {failed && (
        <p className="chat-error" role="alert">
          {copy.sendFailed}
        </p>
      )}
      <Composer busy={busy} onSend={send} onStop={() => abort.current?.abort()} />
    </section>
  );
}
