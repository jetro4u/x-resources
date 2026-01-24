// lib/redis.ts
import { Redis } from '@upstash/redis';
import type { WaitlistEntry } from '@/types';

// Create Redis client from env vars
export const redis = Redis.fromEnv();

export async function addToWaitlist(entry: WaitlistEntry): Promise<boolean> {
  try {
    // Check if already exists (using set membership)
    const exists = await redis.sismember('waitlist:emails', entry.email);
    if (exists) {
      return false;
    }

    // Add to set
    await redis.sadd('waitlist:emails', entry.email);
    
    // Store details (hash) - convert to unknown first, then to Record
    await redis.hset(`waitlist:details:${entry.email}`, entry as unknown as Record<string, unknown>);

    // Increment counter
    await redis.incr('waitlist:count');

    return true;
  } catch (error) {
    console.error('Redis error:', error);
    throw error;
  }
}

export async function getWaitlistCount(): Promise<number> {
  try {
    const count = await redis.get<number>('waitlist:count');
    return count || 0;
  } catch (error) {
    console.error('Redis error:', error);
    return 0;
  }
}