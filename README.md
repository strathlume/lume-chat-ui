# lume-chat-ui

The chat front end for LUME, the assistant Strathlume staff use for questions on customer accounts, tariffs and field maintenance.

We build LUME in-house and publish this front end as open source. It is a plain Vite, React and TypeScript app. It talks to the LUME API only, never to a model directly, so it carries no model keys and no prompts.

## Run it

You need Node.js (version in `.nvmrc`).

```sh
npm ci
cp .env.example .env.local
npm run dev
```

Then open http://localhost:5173.

Checks, as CI runs them:

```sh
npm run typecheck
npm test
npm run build
```

## Environments

`VITE_LUME_ENV` picks the backend at build time. The hostnames are in `src/config/environments.ts`.

| Environment | API | Auth |
| --- | --- | --- |
| `production` | LUME API | Entra ID sign-in, the UI sends the access token |
| `staging` | LUME staging API | API key, for local work only |
| `demo` | none, canned answers | none, used by the public demo site |

Production builds need `VITE_ENTRA_TENANT_ID`, `VITE_ENTRA_CLIENT_ID` and `VITE_ENTRA_API_SCOPE`. Only Strathlume accounts can sign in.

## API

The UI calls `POST /v1/chat/completions` on the LUME API with `stream: true` and reads the answer as server-sent events, in the OpenAI-compatible format. Any backend that speaks that format works with this UI.

## Contributing

This repo is a public mirror. See [CONTRIBUTING.md](CONTRIBUTING.md).

## Security

See [SECURITY.md](SECURITY.md).

## Licence

MIT, see [LICENSE](LICENSE).
