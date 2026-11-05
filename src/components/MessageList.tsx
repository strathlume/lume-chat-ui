import { useEffect, useRef } from "react";
import type { ChatMessage } from "../api/types";
import { copy } from "../copy";

export function MessageList({ messages, busy }: { messages: ChatMessage[]; busy: boolean }) {
  const container = useRef<HTMLDivElement>(null);
  const following = useRef(true);

  // Follow the answer only while the reader is at the bottom, and jump there directly.
  // Smooth scrolling on every streamed word made the view jump.
  useEffect(() => {
    const element = container.current;
    if (element && following.current) element.scrollTop = element.scrollHeight;
  }, [messages]);

  const onScroll = () => {
    const element = container.current;
    if (element) following.current = element.scrollHeight - element.scrollTop - element.clientHeight < 48;
  };

  return (
    <div className="messages" ref={container} onScroll={onScroll}>
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
    </div>
  );
}
