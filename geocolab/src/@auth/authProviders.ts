// auth.providers.ts
import type { Provider } from 'next-auth/providers';
import Credentials from 'next-auth/providers/credentials';
import Facebook from 'next-auth/providers/facebook';
import Google from 'next-auth/providers/google';

// ─────────────────────────────────────────────
// Providers (shared)
// ─────────────────────────────────────────────
export const providers: Provider[] = [
  Credentials({
    authorize(formInput) {
      // Sign in
      if (formInput.formType === 'signin') {
        if (
          formInput.password === '' ||
          formInput.email !== 'admin@fusetheme.com'
        ) {
          return null;
        }
      }

      // Sign up
      if (formInput.formType === 'signup') {
        if (formInput.password === '' || formInput.email === '') {
          return null;
        }
      }

      return {
        email: formInput?.email as string
      };
    }
  }),
  Google,
  Facebook
];

// ─────────────────────────────────────────────
// Client-safe provider metadata
// ─────────────────────────────────────────────
export type AuthJsProvider = {
  id: string;
  name: string;
  style?: {
    text?: string;
    bg?: string;
  };
};

export const authJsProviderMap: AuthJsProvider[] = providers
  .map((provider) => {
    const providerData =
      typeof provider === 'function' ? provider() : provider;

    return {
      id: providerData.id,
      name: providerData.name,
      style: {
        text: (providerData as any).style?.text,
        bg: (providerData as any).style?.bg
      }
    };
  })
  .filter((provider) => provider.id !== 'credentials');