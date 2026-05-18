import { validateEnv } from "./lib/env";

export function register() {
  // Runs once per server process. Fail fast in production if env is wrong.
  const result = validateEnv(process.env);
  if (!result.ok) {
    if (process.env.NODE_ENV === "production") {
      // eslint-disable-next-line no-console
      console.error("FATAL: env validation failed");
      for (const e of result.errors) {
        // eslint-disable-next-line no-console
        console.error(`  - ${e}`);
      }
      process.exit(1);
    } else {
      // eslint-disable-next-line no-console
      console.warn("env warnings (dev mode, not exiting):");
      for (const e of result.errors) {
        // eslint-disable-next-line no-console
        console.warn(`  - ${e}`);
      }
    }
  }
}
