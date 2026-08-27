import * as z from "zod";


const envSchema = z.object({
  NODE_ENV: z
    .enum([
      "development",
      "test",
      "production",
    ])
    .default("development"),

  PORT: z.coerce
    .number()
    .int()
    .positive()
    .default(5000),

  MONGO_URI: z
    .string()
    .min(
      1,
      "MONGO_URI is required"
    ),

  CLIENT_URL: z
    .string()
    .min(
      1,
      "CLIENT_URL is required"
    ),

  JWT_SECRET: z
    .string()
    .min(
      32,
      "JWT_SECRET should contain at least 32 characters"
    ),

  JWT_EXPIRES_IN: z
    .string()
    .default("7d"),

  GEMINI_API_KEY: z
    .string()
    .min(
      1,
      "GEMINI_API_KEY is required"
    ),

  REDIS_URL: z
    .string()
    .min(
      1,
      "REDIS_URL is required"
    ),
});


export const validateEnv = () => {
  const result =
    envSchema.safeParse(
      process.env
    );

  if (!result.success) {
    console.error(
      "\n❌ Invalid environment configuration:\n"
    );

    for (
      const issue
      of result.error.issues
    ) {
      console.error(
        `- ${issue.path.join(".")}: ${issue.message}`
      );
    }

    process.exit(1);
  }

  console.log(
    "✅ Environment configuration validated"
  );

  return result.data;
};