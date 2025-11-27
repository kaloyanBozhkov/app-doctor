"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.env = void 0;
const zod_1 = require("zod");
exports.env = require("@t3-oss/env-core").createEnv({
    server: {
        NODE_ENV: zod_1.z
            .enum(["development", "production", "test"])
            .default("development"),
        PORT: zod_1.z.string().transform(Number).default("3000"),
        X_API_KEY: zod_1.z.string().min(1),
    },
    runtimeEnv: process.env,
    emptyStringAsUndefined: true,
});
//# sourceMappingURL=env.js.map