import {
  ChatModelError,
  type ChatModel,
  type ChatRequest,
  type ChatResponse,
} from "../domain/chat-model.ts";

const GROQ_URL = "https://api.groq.com/openai/v1/chat/completions";

export type FetchFn = (url: string, init: RequestInit) => Promise<Response>;

export interface GroqConfig {
  apiKey: string;
  model: string;
  fetch?: FetchFn;
}

// Subset of the OpenAI-compatible response that Groq returns.
interface GroqCompletion {
  model: string;
  choices: { message: { content: string | null } }[];
  usage: { prompt_tokens: number; completion_tokens: number };
}

export class GroqChatModel implements ChatModel {
  constructor(private readonly config: GroqConfig) {}

  async complete(request: ChatRequest): Promise<ChatResponse> {
    const doFetch = this.config.fetch ?? fetch;
    const response = await doFetch(GROQ_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${this.config.apiKey}`,
      },
      body: JSON.stringify({
        model: this.config.model,
        messages: request.messages,
        temperature: request.temperature,
        max_completion_tokens: request.maxTokens,
      }),
    });

    if (!response.ok) {
      const detail = await response.text();
      throw new ChatModelError(`Groq returned ${response.status}: ${detail}`, response.status);
    }

    const data = (await response.json()) as GroqCompletion;
    return {
      content: data.choices[0]?.message.content ?? "",
      model: data.model,
      usage: {
        inputTokens: data.usage.prompt_tokens,
        outputTokens: data.usage.completion_tokens,
      },
    };
  }
}
