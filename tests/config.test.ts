import { describe, expect, test } from "bun:test";
import { loadConfig } from "../src/config.ts";

describe("loadConfig", () => {
  test("fails fast when the API key is missing", () => {
    expect(() => loadConfig({})).toThrow("GROQ_API_KEY is missing");
  });

  test("uses the default model when none is set", () => {
    expect(loadConfig({ GROQ_API_KEY: "k" })).toEqual({
      groqApiKey: "k",
      groqModel: "openai/gpt-oss-20b",
    });
  });

  test("respects an explicit model", () => {
    expect(loadConfig({ GROQ_API_KEY: "k", GROQ_MODEL: "openai/gpt-oss-120b" }).groqModel).toBe(
      "openai/gpt-oss-120b",
    );
  });
});
