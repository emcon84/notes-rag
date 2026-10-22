import { GroqChatModel } from "./chat/adapters/groq-chat-model.ts";
import { ask } from "./chat/application/ask.ts";
import { loadConfig } from "./config.ts";

// Composition root: the only place that knows which adapters are wired in.
async function main(): Promise<void> {
  const question = process.argv.slice(2).join(" ");
  if (question.trim() === "") {
    console.error('Usage: bun run ask "your question"');
    process.exit(1);
  }

  const config = loadConfig();
  const chat = new GroqChatModel({ apiKey: config.groqApiKey, model: config.groqModel });
  const result = await ask(chat, question);

  console.log(result.answer);
  console.log(
    `\n— ${result.model} · ${result.usage.inputTokens} in / ${result.usage.outputTokens} out tokens · ${result.latencyMs} ms`,
  );
}

main().catch((error: unknown) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
