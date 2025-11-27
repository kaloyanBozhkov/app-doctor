"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.env = void 0;
const zod_1 = require("zod");
const envSchema = zod_1.z.object({
    NODE_ENV: zod_1.z
        .enum(["development", "production", "test"])
        .default("development"),
    PORT: zod_1.z.string().transform(Number).default("3000"),
    X_API_KEY: zod_1.z.string().min(1),
    TG_BOT_KEY: zod_1.z.string().min(1),
});
exports.env = envSchema.parse(process.env);
//# sourceMappingURL=env.js.map