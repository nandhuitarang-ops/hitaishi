import { defineConfig } from "vitest/config";
import path from "node:path";

export default defineConfig({
  test: {
    globals: true,
    environment: "node",
    include: ["**/*.test.ts", "**/*.test.tsx"],
    coverage: {
      provider: "v8",
      reporter: ["text", "html"],
      thresholds: { lines: 80, functions: 80, branches: 70, statements: 80 },
      include: ["lib/**", "db/**", "middleware.ts"],
    },
  },
  resolve: {
    alias: { "@": path.resolve(__dirname) },
  },
});
