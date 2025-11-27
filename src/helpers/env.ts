import { z } from "zod";

const envSchema = z.object({
  NODE_ENV: z
    .enum(["development", "production", "test"])
    .default("development"),
  PORT: z.string().transform(Number).default("3000"),
  X_API_KEY: z.string().min(1),
});

export const env = envSchema.parse(process.env);
