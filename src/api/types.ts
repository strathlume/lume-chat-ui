export type Role = "user" | "assistant";

export interface Source {
  title: string;
  url?: string;
}

export interface ChatMessage {
  role: Role;
  content: string;
  sources?: Source[];
}

export interface ChatClient {
  /** Streams the answer through onDelta and resolves with the sources behind it. */
  send(history: ChatMessage[], onDelta: (text: string) => void, signal?: AbortSignal): Promise<Source[]>;
}
