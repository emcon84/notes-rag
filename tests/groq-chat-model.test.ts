import { describe, expect, test } from "bun:test";
import { GroqChatModel, type FetchFn } from "../src/chat/adapters/groq-chat-model.ts";
import { ChatModelError } from "../src/chat/domain/chat-model.ts";

function fakeFetch(status: number, body: unknown) {
  const calls: { url: string; init: RequestInit }[] = [];
  const fetch: FetchFn = async (url, init) => {
    calls.push({ url, init });
    return new Response(JSON.stringify(body), { status });
  };
  return { fetch, calls };
}

const completion = {
  model: "llama-3.3-70b-versatile",
  choices: [{ message: { content: "Hello!" } }],
  usage: { prompt_tokens: 12, completion_tokens: 4 },
};

describe("GroqChatModel", () => {
  test("sends an OpenAI-compatible request with the API key", async () => {
    const { fetch, calls } = fakeFetch(200, completion);
    const chat = new GroqChatModel({ apiKey: "secret", model: "llama-3.3-70b-versatile", fetch });

    await chat.complete({ messages: [{ role: "user", content: "Hi" }], maxTokens: 50 });

    const call = calls[0]!;
    expect(call.url).toBe("https://api.groq.com/openai/v1/chat/completions");
    expect((call.init.headers as Record<string, string>).Authorization).toBe("Bearer secret");
    expect(JSON.parse(call.init.body as string)).toEqual({
      model: "llama-3.3-70b-versatile",
      messages: [{ role: "user", content: "Hi" }],
      max_completion_tokens: 50,
    });
  });

  test("maps the response to the domain shape", async () => {
    const { fetch } = fakeFetch(200, completion);
    const chat = new GroqChatModel({ apiKey: "secret", model: "m", fetch });

    const response = await chat.complete({ messages: [{ role: "user", content: "Hi" }] });

    expect(response).toEqual({
      content: "Hello!",
      model: "llama-3.3-70b-versatile",
      usage: { inputTokens: 12, outputTokens: 4 },
    });
  });

  test("throws a ChatModelError with the status on HTTP errors", async () => {
    const { fetch } = fakeFetch(429, { error: "rate limited" });
    const chat = new GroqChatModel({ apiKey: "secret", model: "m", fetch });

    const error = await chat.complete({ messages: [] }).catch((e: unknown) => e);

    expect(error).toBeInstanceOf(ChatModelError);
    expect((error as ChatModelError).status).toBe(429);
  });
});
