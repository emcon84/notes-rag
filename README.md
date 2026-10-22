# notes-rag

A retrieval-augmented generation (RAG) assistant that answers questions about your own notes, with citations to the source documents.

Built step by step as a learning project. Each phase adds one production concern and is covered by tests.

## Architecture

Hexagonal (ports and adapters). The application layer depends only on ports. Providers are adapters wired in a single composition root (`src/cli.ts`).

```
            ┌──────────────────────────────┐
  CLI ────▶ │  application (use cases)     │
            │        │                     │
            │        ▼                     │
            │  domain ports: ChatModel     │
            └────────┬─────────────────────┘
                     │ implemented by
                     ▼
              adapters: GroqChatModel (tests use FakeChatModel)
```

Swapping the LLM provider means writing one new adapter. No use case changes.

## Stack

- TypeScript on [Bun](https://bun.sh)
- Chat model: [Groq](https://console.groq.com) (`llama-3.3-70b-versatile` by default)
- Embeddings: [Ollama](https://ollama.com) running locally (planned)
- Vector store: PostgreSQL with pgvector (planned)

## Roadmap

- [x] **Phase 1:** Hexagonal skeleton, `ChatModel` port, Groq adapter, token usage and latency reporting
- [ ] **Phase 2:** Document ingestion, chunking and embeddings
- [ ] **Phase 3:** Semantic search and RAG answers with citations
- [ ] **Phase 4:** Evaluation suite (golden dataset, LLM-as-judge)
- [ ] **Phase 5:** Hybrid search (vector + keyword) and reranking, measured against the evals
- [ ] **Phase 6:** Agent with tool use and an MCP server
- [ ] **Phase 7:** Production hardening: tracing, caching, retries, prompt-injection defenses

## Getting started

```bash
bun install
cp .env.example .env   # then set GROQ_API_KEY
bun run ask "What is retrieval-augmented generation?"
```

Example output:

```
Retrieval-augmented generation is ...

— llama-3.3-70b-versatile · 48 in / 112 out tokens · 640 ms
```

## Development

```bash
bun test           # unit tests, no network calls
bun run typecheck  # strict TypeScript checks
```

## License

MIT
