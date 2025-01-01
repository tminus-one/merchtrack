if (process.env.NODE_ENV !== 'production') {
  import('dotenv').then((dotenv) => {
    dotenv.config();
  });
}

export const NODE_ENV: string = process.env.NODE_ENV ?? 'development',
  API_PORT: string = process.env.API_PORT ?? '3000',
  DATABASE_URL: string = process.env.MONGODB_URI ?? 'postgres://postgres@localhost:5432/merchtrack',
  CLERK_SECRET_KEY: string = process.env.CLERK_SECRET_KEY ?? '',
  NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: string = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY ?? '',
  NEXT_TELEMETRY_DISABLED: string = process.env.NEXT_TELEMETRY_DISABLED ?? '1',
  NEXT_PUBLIC_CLERK_SIGN_IN_URL: string = process.env.NEXT_PUBLIC_CLERK_SIGN_IN_URL ?? '/sign-in',
  NEXT_PUBLIC_CLERK_SIGN_UP_URL: string = process.env.NEXT_PUBLIC_CLERK_SIGN_UP_URL ?? '/sign-up',
  NEXT_PUBLIC_CLERK_SIGN_IN_FORCE_REDIRECT_URL: string = process.env.NEXT_PUBLIC_CLERK_SIGN_IN_FORCE_REDIRECT_URL ?? '/dashboard',
  NEXT_PUBLIC_CLERK_SIGN_IN_FALLBACK_REDIRECT_URL: string = process.env.NEXT_PUBLIC_CLERK_SIGN_IN_FALLBACK_REDIRECT_URL ?? '/dashboard';

