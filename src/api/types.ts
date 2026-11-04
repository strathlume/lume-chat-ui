export type Role = "user" | "assistant";

export interface ChatMessage {
  role: Role;
  content: string;
}

export interface ChatClient {
  send(history: ChatMessage[], onDelta: (text: string) => void, signal?: AbortSignal): Promise<void>;
}
