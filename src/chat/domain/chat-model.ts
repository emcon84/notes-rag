export type Role = "system" | "user" | "assistant";

export interface ChatMessage {
  role: Role;
  content: string;
}

export interface TokenUsage {
  inputTokens: number;
  outputTokens: number;
}

export interface ChatRequest {
  messages: ChatMessage[];
  temperature?: number;
  maxTokens?: number;
}

export interface ChatResponse {
  content: string;
  usage: TokenUsage;
  model: string;
}

// Port: the application depends on this contract, never on a concrete provider.
export interface ChatModel {
  complete(request: ChatRequest): Promise<ChatResponse>;
}

export class ChatModelError extends Error {
  constructor(
    message: string,
    readonly status?: number,
  ) {
    super(message);
    this.name = "ChatModelError";
  }
}
