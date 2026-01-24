// adapters/memflux-adapter.ts
import type { Adapter, AdapterUser, AdapterAccount, AdapterSession, VerificationToken } from 'next-auth/adapters';
import type { MemFlux } from '@dndhub/memflux';

interface StorageBackend {
  get(key: string): Promise<unknown | undefined>;
  set(key: string, value: unknown, options?: { ttl?: number }): Promise<void>;
  delete(key: string): Promise<boolean>;
  has(key: string): Promise<boolean>;
  keys(): AsyncIterableIterator<string>;
}

/**
 * NextAuth adapter for MemFlux storage
 */
export function MemFluxAdapter(storage: MemFlux<string, unknown> | StorageBackend): Adapter {
  const normalizeKey = (key: string): string => {
    return key.replace(/:/g, '_');
  };

  const getKey = (type: string, id: string): string => {
    return normalizeKey(`${type}:${id}`);
  };

  return {
    async createUser(user: Omit<AdapterUser, 'id'>): Promise<AdapterUser> {
      const id = crypto.randomUUID();
      const newUser: AdapterUser = { ...user, id };
      
      await storage.set(getKey('user', id), newUser);
      await storage.set(getKey('user_by_email', user.email), id);
      
      return newUser;
    },

    async getUser(id: string): Promise<AdapterUser | null> {
      const user = await storage.get(getKey('user', id)) as AdapterUser | undefined;
      return user ?? null;
    },

    async getUserByEmail(email: string): Promise<AdapterUser | null> {
      const userId = await storage.get(getKey('user_by_email', email)) as string | undefined;
      if (!userId) return null;
      
      const user = await storage.get(getKey('user', userId)) as AdapterUser | undefined;
      return user ?? null;
    },

    async getUserByAccount({ providerAccountId, provider }): Promise<AdapterUser | null> {
      const accountKey = getKey('account', `${provider}_${providerAccountId}`);
      const account = await storage.get(accountKey) as AdapterAccount | undefined;
      
      if (!account) return null;
      
      const user = await storage.get(getKey('user', account.userId)) as AdapterUser | undefined;
      return user ?? null;
    },

    async updateUser(user: Partial<AdapterUser> & Pick<AdapterUser, 'id'>): Promise<AdapterUser> {
      const existingUser = await storage.get(getKey('user', user.id)) as AdapterUser | undefined;
      
      if (!existingUser) {
        throw new Error(`User ${user.id} not found`);
      }
      
      const updatedUser: AdapterUser = { ...existingUser, ...user };
      await storage.set(getKey('user', user.id), updatedUser);
      
      return updatedUser;
    },

    async deleteUser(userId: string): Promise<void> {
      const user = await storage.get(getKey('user', userId)) as AdapterUser | undefined;
      
      if (user?.email) {
        await storage.delete(getKey('user_by_email', user.email));
      }
      
      await storage.delete(getKey('user', userId));
      
      // Delete associated accounts
      for await (const key of storage.keys()) {
        if (typeof key === 'string' && key.startsWith('account_')) {
          const account = await storage.get(key) as AdapterAccount | undefined;
          if (account?.userId === userId) {
            await storage.delete(key);
          }
        }
      }
      
      // Delete associated sessions
      for await (const key of storage.keys()) {
        if (typeof key === 'string' && key.startsWith('session_')) {
          const session = await storage.get(key) as AdapterSession | undefined;
          if (session?.userId === userId) {
            await storage.delete(key);
          }
        }
      }
    },

    async linkAccount(account: AdapterAccount): Promise<void> {
      const accountKey = getKey('account', `${account.provider}_${account.providerAccountId}`);
      await storage.set(accountKey, account);
    },

    async unlinkAccount({ providerAccountId, provider }): Promise<void> {
      const accountKey = getKey('account', `${provider}_${providerAccountId}`);
      await storage.delete(accountKey);
    },

    async createSession(session: { sessionToken: string; userId: string; expires: Date }): Promise<AdapterSession> {
      const newSession: AdapterSession = session;
      await storage.set(getKey('session', session.sessionToken), newSession, {
        ttl: session.expires.getTime() - Date.now()
      });
      
      return newSession;
    },

    async getSessionAndUser(sessionToken: string): Promise<{ session: AdapterSession; user: AdapterUser } | null> {
      const session = await storage.get(getKey('session', sessionToken)) as AdapterSession | undefined;
      
      if (!session) return null;
      
      // Check expiration
      if (session.expires < new Date()) {
        await storage.delete(getKey('session', sessionToken));
        return null;
      }
      
      const user = await storage.get(getKey('user', session.userId)) as AdapterUser | undefined;
      
      if (!user) return null;
      
      return { session, user };
    },

    async updateSession(session: Partial<AdapterSession> & Pick<AdapterSession, 'sessionToken'>): Promise<AdapterSession | null | undefined> {
      const existingSession = await storage.get(getKey('session', session.sessionToken)) as AdapterSession | undefined;
      
      if (!existingSession) return null;
      
      const updatedSession: AdapterSession = { ...existingSession, ...session };
      
      await storage.set(getKey('session', session.sessionToken), updatedSession, {
        ttl: updatedSession.expires.getTime() - Date.now()
      });
      
      return updatedSession;
    },

    async deleteSession(sessionToken: string): Promise<void> {
      await storage.delete(getKey('session', sessionToken));
    },

    async createVerificationToken(token: VerificationToken): Promise<VerificationToken> {
      const key = getKey('verification', `${token.identifier}_${token.token}`);
      const ttl = token.expires.getTime() - Date.now();
      
      await storage.set(key, token, { ttl });
      
      return token;
    },

    async useVerificationToken({ identifier, token }): Promise<VerificationToken | null> {
      const key = getKey('verification', `${identifier}_${token}`);
      const verificationToken = await storage.get(key) as VerificationToken | undefined;
      
      if (!verificationToken) return null;
      
      await storage.delete(key);
      
      return verificationToken;
    }
  };
}