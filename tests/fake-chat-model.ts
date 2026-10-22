import type { ChatModel, ChatRequest, ChatResponse } from "../src/chat/domain/chat-model.ts";

// Test double: records every request and returns a canned response.
export class FakeChatModel implements ChatModel {
  readonly requests: ChatRequest[] = [];

  constructor(private readonly reply: ChatResponse) {}

  async complete(request: ChatRequest): Promise<ChatResponse> {
    this.requests.push(request);
    return this.reply;
  }
}
