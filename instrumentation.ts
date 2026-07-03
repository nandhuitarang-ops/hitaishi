import { validateEnv } from "./lib/env";

// Pin to the Node.js runtime — `process.exit` is not available on the edge.
export const runtime = "nodejs";

export function register() {
  // Runs once per server process. Log env issues but NEVER exit in serverless.
  const result = validateEnv(process.env);
  if (!result.ok) {
    // eslint-disable-next-line no-console
    console.error("ENV VALIDATION FAILED:");
    for (const e of result.errors) {
      // eslint-disable-next-line no-console
      console.error(`  - ${e}`);
    }
    // NOTE: Do NOT call process.exit(1) here — it crashes serverless functions
    // and causes 500s for every dynamic route. Let the app start so we can
    // surface errors gracefully or let non-affected routes work.
  }
}
