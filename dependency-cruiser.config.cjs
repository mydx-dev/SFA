module.exports = {
    forbidden: [
        {
            name: "no-circular",
            severity: "error",
            from: {},
            to: { circular: true },
        },
        {
            name: "controller-only-to-usecase-shared-di",
            severity: "error",
            from: { path: "^src/backend/presentation/controller" },
            to: {
                path: "^src/backend/(application/service|domain|infrastructure|main)",
            },
        },
        {
            name: "usecase-only-to-service-domain-shared",
            severity: "error",
            from: { path: "^src/backend/application/usecase" },
            to: { path: "^src/backend/(presentation|infrastructure|di|main)" },
        },
        {
            name: "service-only-to-domain-infra-shared",
            severity: "error",
            from: { path: "^src/backend/application/service" },
            to: {
                path: "^src/backend/(presentation|application/usecase|di|main)",
            },
        },
        {
            name: "domain-no-backend-deps",
            severity: "error",
            from: { path: "^src/backend/domain" },
            to: {
                path: "^src/backend/(presentation|application|infrastructure|di|main)",
            },
        },
        {
            name: "infra-only-to-domain-shared",
            severity: "error",
            from: { path: "^src/backend/infrastructure" },
            to: {
                path: "^src/backend/(presentation|application|di|main)",
            },
        },
        {
            name: "functions-only-to-controller-di-shared",
            severity: "error",
            from: { path: "^src/backend/main" },
            to: { path: "^src/backend/(application|domain|infrastructure)" },
        },
        {
            name: "shared-no-backend-deps",
            severity: "error",
            from: { path: "^src/shared" },
            to: { path: "^src/backend" },
        },
    ],
    options: {
        doNotFollow: {
            path: "node_modules",
        },
        includeOnly: "^src",
        tsConfig: {
            fileName: "tsconfig.json",
        },
        enhancedResolveOptions: {
            extensions: [".ts", ".js"],
        },
    },
};
