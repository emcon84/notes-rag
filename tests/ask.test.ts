import { describe, expect, test } from "bun:test";
import { ask } from "../src/chat/application/ask.ts";
import { FakeChatModel } from "./fake-chat-model.ts";

const reply = {
  content: "Paris",
  model: "fake-model",
  usage: { inputTokens: 20, outputTokens: 3 },
};

describe("ask", () => {
  test("sends a system prompt and the trimmed question", async () => {
    const chat = new FakeChatModel(reply);

    await ask(chat, "  Capital of France?  ");

    const messages = chat.requests[0]?.messages;
    expect(messages?.[0]?.role).toBe("system");
    expect(messages?.[1]).toEqual({ role: "user", content: "Capital of France?" });
  });

  test("returns the answer, usage and measured latency", async () => {
    const ticks = [100, 350];
    const result = await ask(new FakeChatModel(reply), "Capital of France?", () => ticks.shift() ?? 0);

    expect(result).toEqual({
      answer: "Paris",
      model: "fake-model",
      usage: { inputTokens: 20, outputTokens: 3 },
      latencyMs: 250,
    });
  });

  test("rejects an empty question without calling the model", async () => {
    const chat = new FakeChatModel(reply);

    await expect(ask(chat, "   ")).rejects.toThrow("Question must not be empty");
    expect(chat.requests).toHaveLength(0);
  });
});
