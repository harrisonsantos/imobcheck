import '@testing-library/jest-dom';

// Mock environment variables for tests
process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://test.supabase.co';
process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = 'test-anon-key';
process.env.SUPABASE_SERVICE_ROLE_KEY = 'test-service-role-key';
process.env.RESEND_API_KEY = 'test-resend-key';
process.env.EMAIL_FROM = 'test@example.com';
process.env.EMAIL_TO = 'admin@example.com';
process.env.CRON_SECRET = 'test-cron-secret';
process.env.NEXT_PUBLIC_APP_URL = 'http://localhost:3000';
process.env.VISTA_API_KEY = 'test-vista-key';
process.env.VISTA_API_URL = 'http://test-vista.com';
process.env.VISTA_WEBHOOK_SECRET = 'test-webhook-secret';
