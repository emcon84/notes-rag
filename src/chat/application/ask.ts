import type { ChatModel, TokenUsage } from "../domain/chat-model.ts";

const SYSTEM_PROMPT =
  "You are a concise assistant. Answer in the same language as the question. " +
  "If you do not know the answer, say so instead of guessing.";

export interface AskResult {
  answer: string;
  model: string;
  usage: TokenUsage;
  latencyMs: number;
}

export async function ask(
  chat: ChatModel,
  question: string,
  now: () => number = () => performance.now(),
): Promise<AskResult> {
  const trimmed = question.trim();
  if (trimmed === "") throw new Error("Question must not be empty");

  const start = now();
  const response = await chat.complete({
    messages: [
      { role: "system", content: SYSTEM_PROMPT },
      { role: "user", content: trimmed },
    ],
    temperature: 0.2,
    maxTokens: 512,
  });

  return {
    answer: response.content,
    model: response.model,
    usage: response.usage,
    latencyMs: Math.round(now() - start),
  };
}
