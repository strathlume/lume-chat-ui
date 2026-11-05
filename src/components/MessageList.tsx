import { useEffect, useRef } from "react";
import type { ChatMessage } from "../api/types";
import { copy } from "../copy";

export function MessageList({ messages, busy }: { messages: ChatMessage[]; busy: boolean }) {
  const end = useRef<HTMLDivElement>(null);

  useEffect(() => {
    end.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages]);

  return (
    <div className="messages">
      <ol aria-live="polite">
        {messages.map((message, index) => (
          <li key={index} className={`message message-${message.role}`}>
            <span className="message-author">{message.role === "user" ? copy.you : "LUME"}</span>
            <div className="message-body">
              {message.content || (busy && index === messages.length - 1 ? copy.thinking : "")}
            </div>
            {message.sources && message.sources.length > 0 && (
              <ul className="message-sources" aria-label={copy.sources}>
                {message.sources.map((source) => (
                  <li key={source.title}>
                    {source.url ? (
                      <a href={source.url} target="_blank" rel="noreferrer">
                        {source.title}
                      </a>
                    ) : (
                      source.title
                    )}
                  </li>
                ))}
              </ul>
            )}
          </li>
        ))}
      </ol>
      <div ref={end} />
    </div>
  );
}
