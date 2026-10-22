export interface Config {
  groqApiKey: string;
  groqModel: string;
}

// Groq retires models often: check `GET /openai/v1/models` when a 404 model_not_found appears.
const DEFAULT_GROQ_MODEL = "openai/gpt-oss-20b";

export function loadConfig(env: Record<string, string | undefined> = process.env): Config {
  const groqApiKey = env.GROQ_API_KEY?.trim();
  if (!groqApiKey) {
    throw new Error("GROQ_API_KEY is missing. Copy .env.example to .env and set it.");
  }
  return {
    groqApiKey,
    groqModel: env.GROQ_MODEL?.trim() || DEFAULT_GROQ_MODEL,
  };
}
