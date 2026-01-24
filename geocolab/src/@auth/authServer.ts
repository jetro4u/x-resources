// auth.server.ts
import 'server-only';

import NextAuth from 'next-auth';
import type { NextAuthConfig } from 'next-auth';
import { User } from '@auth/user';

import { authGetDbUserByEmail, authCreateDbUser } from './authApi';
import { MemFlux } from '@dndhub/memflux';
import { MemFluxAdapter } from './adapters/memflux-adapter';
import { VercelKVStorage } from './adapters/vercel-kv-storage';

import { providers } from './authProviders';

// ─────────────────────────────────────────────
// Storage selection (Node-only)
// ─────────────────────────────────────────────
const storage = process.env.VERCEL
  ? new VercelKVStorage({
      url: process.env.AUTH_KV_REST_API_URL,
      token: process.env.AUTH_KV_REST_API_TOKEN,
      base: 'auth',
      ttl: 30 * 24 * 60 * 60 * 1000 // 30 days
    })
  : new MemFlux({
      driver: 'js',
      maxEntries: 10_000,
      defaultTTL: 30 * 24 * 60 * 60 * 1000,
      evictionStrategy: 'lru',
      telemetry: true
    });

// ─────────────────────────────────────────────
// NextAuth config (SERVER)
// ─────────────────────────────────────────────
const config = {
  theme: { logo: '/assets/images/logo/logo.svg' },
  adapter: MemFluxAdapter(storage),
  pages: {
    signIn: '/sign-in'
  },
  providers,
  basePath: '/auth',
  trustHost: true,

  callbacks: {
    authorized() {
      return true;
    },

    jwt({ token, trigger, account, user }) {
      if (trigger === 'update') {
        token.name = user.name;
      }

      if (account?.provider === 'keycloak') {
        return { ...token, accessToken: account.access_token };
      }

      return token;
    },

    async session({ session, token }) {
      if (token.accessToken && typeof token.accessToken === 'string') {
        session.accessToken = token.accessToken;
      }

      if (!session?.user?.email) {
        return session;
      }

      try {
        const response = await authGetDbUserByEmail(session.user.email);
        const userDbData = (await response.json()) as User;

        session.db = userDbData;
        return session;
      } catch (error: any) {
        if (error?.status === 404) {
          const newUserResponse = await authCreateDbUser({
            email: session.user.email,
            role: ['admin'],
            displayName: session.user.name,
            photoURL: session.user.image
          });

          session.db = (await newUserResponse.json()) as User;
          return session;
        }

        throw error;
      }
    }
  },

  experimental: {
    enableWebAuthn: true
  },

  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60
  },

  debug: process.env.NODE_ENV !== 'production'
} satisfies NextAuthConfig;

// ─────────────────────────────────────────────
// Exports (SERVER ONLY)
// ─────────────────────────────────────────────
export const { handlers, auth, signIn, signOut } = NextAuth(config);