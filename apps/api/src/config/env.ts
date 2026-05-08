export const config = {
  port: process.env.PORT || 3001,
  nodeEnv: process.env.NODE_ENV || "development",
  frontendUrl: process.env.FRONTEND_URL || "http://localhost:3000",
  anthropicApiKey: process.env.ANTHROPIC_API_KEY || "",
  resendApiKey: process.env.RESEND_API_KEY || "",
  databaseUrl: process.env.DATABASE_URL || "",
} as const;
