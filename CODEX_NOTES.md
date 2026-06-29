# Codex Notes

## Token Saving Rules For This Repo

- Start with `rg --files`, `rg`, and targeted `Get-Content` calls instead of opening whole folders.
- Read only files that affect the current change path, then widen the search only if imports or errors require it.
- Prefer small compatibility layers, such as `data/api.ts`, before refactoring every screen.
- Keep mock data as a fallback while replacing one feature at a time.
- Summarize command output in final answers instead of pasting full logs.
- Avoid rereading generated files unless a test or type check points at them.
- Use concise progress updates that state what changed or what was learned.
- For Cloudflare work, keep D1 schema, Worker routes, and Expo client code separated so future edits stay targeted.

## Current Backend Direction

- Expo calls a Cloudflare Worker through `EXPO_PUBLIC_API_URL`.
- The Worker owns D1 and R2 bindings.
- D1 stores relational app data and R2 stores media bytes.
- The app should never expose Cloudflare account tokens or direct write secrets.
