import { describe, expect, test } from "bun:test";
import { loadConfig } from "../src/config.ts";

describe("loadConfig", () => {
  test("fails fast when the API key is missing", () => {
    expect(() => loadConfig({})).toThrow("GROQ_API_KEY is missing");
  });

  test("uses the default model when none is set", () => {
    expect(loadConfig({ GROQ_API_KEY: "k" })).toEqual({
      groqApiKey: "k",
      groqModel: "llama-3.3-70b-versatile",
    });
  });

  test("respects an explicit model", () => {
    expect(loadConfig({ GROQ_API_KEY: "k", GROQ_MODEL: "llama-3.1-8b-instant" }).groqModel).toBe(
      "llama-3.1-8b-instant",
    );
  });
});
