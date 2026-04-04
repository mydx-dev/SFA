import { defineConfig } from "vitest/config";

export default defineConfig({
    test: {
        environment: "node",
        globals: true,
        include: ["tests/**/*.test.{ts,tsx}", "tests/**/*.spec.{ts,tsx}"],
        coverage: {
            provider: "v8",
            reporter: ["text", "html", "lcov"],
            thresholds: {
                branches: 100,
            },
        },
    },
    resolve: {
        extensions: [".ts", ".tsx", ".js", ".jsx"],
    },
});
