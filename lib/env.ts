import { z } from 'zod';

const envSchema = z.object({
  NEXT_PUBLIC_SUPABASE_URL: z.string().url(),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(1),
  SUPABASE_SERVICE_ROLE_KEY: z.string().min(1),
  RESEND_API_KEY: z.string().min(1),
  EMAIL_FROM: z.string().email(),
  EMAIL_TO: z.string().email(),
  VISTA_API_KEY: z.string().min(1).optional(),
  VISTA_API_URL: z.string().url().optional(),
  VISTA_WEBHOOK_SECRET: z.string().optional(),
  CRON_SECRET: z.string().min(1),
  NEXT_PUBLIC_APP_URL: z.string().url(),
});

export function getEnv() {
  return envSchema.parse({
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL?.trim(),
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim(),
    SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY?.trim(),
    RESEND_API_KEY: process.env.RESEND_API_KEY?.trim(),
    EMAIL_FROM: process.env.EMAIL_FROM?.trim(),
    EMAIL_TO: process.env.EMAIL_TO?.trim(),
    VISTA_API_KEY: process.env.VISTA_API_KEY?.trim(),
    VISTA_API_URL: process.env.VISTA_API_URL?.trim() || 'http://sandbox-rest.vistahost.com.br',
    VISTA_WEBHOOK_SECRET: process.env.VISTA_WEBHOOK_SECRET?.trim(),
    CRON_SECRET: process.env.CRON_SECRET?.trim(),
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL?.trim() || 'http://localhost:3000',
  });
}
