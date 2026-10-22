export interface Config {
  groqApiKey: string;
  groqModel: string;
}

const DEFAULT_GROQ_MODEL = "llama-3.3-70b-versatile";

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
