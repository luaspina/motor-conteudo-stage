import { z } from "zod";

const envSchema = z.object({
  VITE_SUPABASE_URL: z.string().url("VITE_SUPABASE_URL must be a valid URL"),
  VITE_SUPABASE_ANON_KEY: z.string().min(1, "VITE_SUPABASE_ANON_KEY is required"),
});

function validateEnv() {
  const result = envSchema.safeParse(import.meta.env);

  if (!result.success) {
    const messages = result.error.issues.map((i) => `  • ${i.message}`).join("\n");
    throw new Error(`\n❌ Missing environment variables:\n${messages}\n\nCheck your .env file.`);
  }

  return result.data;
}

export const env = validateEnv();
