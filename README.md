# AI Chats

[![CI](https://github.com/puppe1990/db-code-harness/actions/workflows/ci.yml/badge.svg)](https://github.com/puppe1990/db-code-harness/actions/workflows/ci.yml)

A local web app that aggregates coding-agent chat sessions from **Cursor**, **Grok**, **Codex**, and **OpenCode** into a single timeline sorted by most recent activity.

Built with [TanStack Start](https://tanstack.com/start), React 19, Tailwind CSS, and Vitest.

## Features

- **Unified inbox** — all chats from four tools in one list
- **Sort by recency** — newest sessions first
- **Search** — filter by title, working directory, tool, or model
- **Source filters** — quick chips for Cursor, Grok, Codex, OpenCode
- **Chat detail view** — click a session to read user/assistant messages
- **Light & dark mode** — theme toggle in the header
- **Read-only** — no writes to agent data; safe to run locally

## Supported data sources

| Tool         | Local path                                                              | Format                               |
| ------------ | ----------------------------------------------------------------------- | ------------------------------------ |
| **Grok**     | `~/.grok/sessions/**/summary.json`                                      | JSON metadata + `chat_history.jsonl` |
| **OpenCode** | `~/.local/share/opencode/opencode.db`                                   | SQLite `session` table               |
| **Codex**    | `~/.codex/session_index.jsonl` + `sessions/**` + `archived_sessions/**` | JSONL rollouts                       |
| **Cursor**   | `~/.cursor/chats/*/*/store.db`                                          | SQLite `meta` + `blobs`              |

## Requirements

- Node.js 20+
- macOS or Linux (paths above are Unix-style; Windows would need path overrides)
- The coding agents installed and used at least once on the machine

## Quick start

```bash
git clone https://github.com/puppe1990/db-code-harness.git
cd db-code-harness
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Scripts

| Command               | Description                       |
| --------------------- | --------------------------------- |
| `npm run dev`         | Start dev server on port 3000     |
| `npm run build`       | Production build                  |
| `npm run start`       | Run production server             |
| `npm run preview`     | Preview production build          |
| `npm run pake`        | Build macOS/Linux desktop app     |
| `npm run pake:launch` | Start server and open desktop app |
| `npm run pake:stop`   | Stop background desktop server    |
| `npm test`            | Run Vitest test suite             |
| `npm run test:watch`  | Run tests in watch mode           |

## Desktop app (Pake)

Turn the local web UI into a lightweight desktop app with [Pake](https://github.com/tw93/Pake).

**Prerequisites:** Node.js 22+, Rust (installed automatically by Pake on first run), and `pake-cli`:

```bash
pnpm install -g pake-cli
# or: npx pake-cli
```

**Build the app:**

```bash
npm run pake
```

This builds the project, starts a temporary local server, and generates `AI Chats.app` in the project root (macOS).

**Launch like a native app:**

```bash
npm run pake:launch
```

This starts the production server in the background (if needed) and opens the desktop app pointing to `http://127.0.0.1:3847` (dedicated port, separate from `npm run dev` on 3000).

**Stop the background server:**

```bash
npm run pake:stop
```

Optional env vars:

```env
AI_CHATS_PORT=3847
AI_CHATS_APP_NAME=AI Chats
```

## Configuration

Override default data paths with environment variables:

```env
CURSOR_HOME=~/.cursor
GROK_HOME=~/.grok
CODEX_HOME=~/.codex
OPENCODE_DATA_DIR=~/.local/share/opencode
CLAUDE_HOME=~/.claude
```

## Architecture

```
UI (TanStack Router)
  └── getChats / getChatDetail (server functions)
        └── aggregator
              ├── cursor provider
              ├── grok provider
              ├── codex provider
              └── opencode provider
```

- Providers normalize local files into a shared `ChatSession` type
- `sortByUpdatedAt` merges and orders results
- Message parsers load conversation history per tool on the detail page
- Unit tests use fixtures under `src/lib/**/__fixtures__`

## Project structure

```
src/
├── components/     # ChatList, ChatItem, MessageList, SourceBadge
├── lib/
│   ├── providers/  # Per-tool session readers
│   ├── messages/   # Per-tool message parsers
│   ├── aggregator.ts
│   └── filter-chats.ts
├── routes/         # / and /chat/$chatId
└── server/         # TanStack Start server functions
```

## CI & pre-commit

GitHub Actions runs on every push and PR:

- Prettier check
- ESLint
- Vitest
- Production build

Local pre-commit hook (via Husky + lint-staged):

- Formats staged files with Prettier
- Runs ESLint with `--fix` on staged TypeScript
- Runs the full test suite

Install hooks after cloning:

```bash
npm install   # runs `husky` via the prepare script
```

## Development

This project was built with TDD. When adding a provider or parser:

1. Add a fixture under `__fixtures__/`
2. Write a failing test
3. Implement minimal code
4. Run `npm test`

## License

MIT
