// adapters/vercel-kv-storage.ts
import { createClient } from '@vercel/kv';
import type { VercelKV } from '@vercel/kv';
import { DomsError } from '@dndhub/error';

export interface VercelKVStorageOptions {
  /**
   * Vercel KV REST API URL
   */
  url?: string;

  /**
   * Vercel KV REST API Token
   */
  token?: string;

  /**
   * Optional prefix to use for all keys (namespace)
   */
  base?: string;

  /**
   * Default TTL for all items in milliseconds
   */
  ttl?: number;

  /**
   * How many keys to scan at once
   */
  scanCount?: number;

  /**
   * Environment variable prefix (default: 'AUTH_KV')
   */
  envPrefix?: string;
}

/**
 * Vercel KV storage adapter compatible with MemFlux interface
 */
export class VercelKVStorage<K = string, V = unknown> {
  private client: VercelKV;
  private base: string;
  private defaultTTL?: number;
  private scanCount: number;

  constructor(options: VercelKVStorageOptions = {}) {
    this.base = this.normalizeKey(options.base ?? '');
    this.defaultTTL = options.ttl;
    this.scanCount = options.scanCount ?? 100;

    // Initialize Vercel KV client
    this.client = this.createClient(options);
  }

  private createClient(options: VercelKVStorageOptions): VercelKV {
    const envPrefix = options.envPrefix ?? 'AUTH_KV';
    let url = options.url;
    let token = options.token;

    // Try to get from environment variables if not provided
    if (!url && typeof process !== 'undefined') {
      const envName = `${envPrefix}_REST_API_URL`;
      url = process.env[envName];
      
      if (!url) {
        throw DomsError.create('VERCEL_KV_MISSING_URL', {
          message: `Missing required 'url' option or '${envName}' environment variable`,
          runtime: 'storage'
        });
      }
    }

    if (!token && typeof process !== 'undefined') {
      const envName = `${envPrefix}_REST_API_TOKEN`;
      token = process.env[envName];
      
      if (!token) {
        throw DomsError.create('VERCEL_KV_MISSING_TOKEN', {
          message: `Missing required 'token' option or '${envName}' environment variable`,
          runtime: 'storage'
        });
      }
    }

    if (!url || !token) {
      throw DomsError.create('VERCEL_KV_INVALID_CONFIG', {
        message: 'Both url and token are required for Vercel KV',
        runtime: 'storage'
      });
    }

    return createClient({ url, token });
  }

  private normalizeKey(key: string): string {
    return key.replace(/^\/+|\/+$/g, '').replace(/\/+/g, ':');
  }

  private getFullKey(...keys: string[]): string {
    const normalized = keys.map(k => this.normalizeKey(k)).filter(Boolean);
    return this.base ? `${this.base}:${normalized.join(':')}` : normalized.join(':');
  }

  /**
   * Get a value from storage
   */
  async get(key: K): Promise<V | undefined> {
    try {
      const fullKey = this.getFullKey(String(key));
      const value = await this.client.get<V>(fullKey);
      return value ?? undefined;
    } catch (error) {
      throw DomsError.create('VERCEL_KV_GET_ERROR', {
        message: `Failed to get key: ${String(key)}`,
        runtime: 'storage',
        context: {
            cause: error
        }
      });
    }
  }

  /**
   * Set a value in storage
   */
  async set(key: K, value: V, options?: { ttl?: number }): Promise<void> {
    try {
      const fullKey = this.getFullKey(String(key));
      const ttl = options?.ttl ?? this.defaultTTL;
      
      if (ttl) {
        // TTL in seconds for Vercel KV
        const ttlSeconds = Math.ceil(ttl / 1000);
        await this.client.set(fullKey, value, { ex: ttlSeconds });
      } else {
        await this.client.set(fullKey, value);
      }
    } catch (error) {
      throw DomsError.create('VERCEL_KV_SET_ERROR', {
        message: `Failed to set key: ${String(key)}`,
        runtime: 'storage',
        context: {
            cause: error
        }
      });
    }
  }

  /**
   * Delete a value from storage
   */
  async delete(key: K): Promise<boolean> {
    try {
      const fullKey = this.getFullKey(String(key));
      const result = await this.client.unlink(fullKey);
      return result > 0;
    } catch (error) {
      throw DomsError.create('VERCEL_KV_DELETE_ERROR', {
        message: `Failed to delete key: ${String(key)}`,
        runtime: 'storage',
        context: {
            cause: error
        }
      });
    }
  }

  /**
   * Check if a key exists
   */
  async has(key: K): Promise<boolean> {
    try {
      const fullKey = this.getFullKey(String(key));
      const exists = await this.client.exists(fullKey);
      return exists > 0;
    } catch (error) {
      throw DomsError.create('VERCEL_KV_HAS_ERROR', {
        message: `Failed to check key existence: ${String(key)}`,
        runtime: 'storage',
        context: {
            cause: error
        }
      });
    }
  }

  /**
   * Clear all keys matching a pattern
   */
  async clear(base?: string): Promise<void> {
    try {
      const pattern = this.getFullKey(base ?? '', '*');
      const keys = await this.scanKeys(pattern);
      
      if (keys.length === 0) {
        return;
      }
      
      await this.client.del(...keys);
    } catch (error) {
      throw DomsError.create('VERCEL_KV_CLEAR_ERROR', {
        message: 'Failed to clear storage',
        runtime: 'storage',
        context: {
            cause: error
        }
      });
    }
  }

  /**
   * Get all keys matching a pattern
   */
  async *keys(base?: string): AsyncIterableIterator<K> {
    const pattern = this.getFullKey(base ?? '', '*');
    const allKeys = await this.scanKeys(pattern);
    
    for (const key of allKeys) {
      // Remove base prefix if present
      const strippedKey = this.base 
        ? key.replace(`${this.base}:`, '') 
        : key;
      yield strippedKey as K;
    }
  }

  /**
   * Scan keys matching a pattern using Redis SCAN
   */
  private async scanKeys(pattern: string): Promise<string[]> {
    const keys: string[] = [];
    let cursor = '0';

    do {
      const [nextCursor, scanKeys] = await this.client.scan(cursor, {
        match: pattern,
        count: this.scanCount
      });
      
      cursor = nextCursor;
      keys.push(...scanKeys);
    } while (cursor !== '0');

    return keys;
  }

  /**
   * Get the size of the storage (number of keys)
   */
  async size(): Promise<number> {
    const pattern = this.getFullKey('*');
    const keys = await this.scanKeys(pattern);
    return keys.length;
  }

  /**
   * Get storage instance (for debugging/advanced usage)
   */
  getInstance(): VercelKV {
    return this.client;
  }
}