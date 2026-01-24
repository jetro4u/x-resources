// app/api/waitlist/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { addToWaitlist, redis } from '../../lib/redis';
import type { WaitlistEntry, WaitlistResponse } from '@/types';

/**
 * Validates email format
 */
function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Rate limiting check
 * Prevents spam by limiting requests per IP
 */
async function checkRateLimit(ip: string): Promise<boolean> {
  const key = `ratelimit:waitlist:${ip}`;
  const limit = 5; // Max 5 submissions per hour
  const window = 3600; // 1 hour in seconds

  try {
    const current = await redis.incr(key);
    
    if (current === 1) {
      // First request, set expiration
      await redis.expire(key, window);
    }

    return current <= limit;
  } catch (error) {
    console.error('Rate limit check error:', error);
    // Allow request if rate limit check fails
    return true;
  }
}

/**
 * POST handler for waitlist submissions
 */
export async function POST(request: NextRequest): Promise<NextResponse<WaitlistResponse>> {
  try {
    // Parse request body
    const body = await request.json();
    const { email, timestamp } = body as { email?: string; timestamp?: string };

    // Get client IP for rate limiting
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0].trim() 
      || request.headers.get('x-real-ip')
      || 'unknown';

    // Rate limiting check
    const isAllowed = await checkRateLimit(ip);
    if (!isAllowed) {
      return NextResponse.json(
        { 
          success: false,
          message: 'Too many requests',
          error: 'Please wait before submitting again'
        },
        { 
          status: 429,
          headers: {
            'Retry-After': '3600', // 1 hour
          }
        }
      );
    }

    // Validate email
    if (!email || typeof email !== 'string') {
      return NextResponse.json(
        { 
          success: false,
          message: 'Email is required',
          error: 'Please provide an email address'
        },
        { status: 400 }
      );
    }

    if (!isValidEmail(email)) {
      return NextResponse.json(
        { 
          success: false,
          message: 'Invalid email format',
          error: 'Please provide a valid email address'
        },
        { status: 400 }
      );
    }

    // Normalize email (lowercase, trim)
    const normalizedEmail = email.toLowerCase().trim();

    // Create entry
    const entry: WaitlistEntry = {
      email: normalizedEmail,
      timestamp: timestamp || new Date().toISOString(),
      ip,
      userAgent: request.headers.get('user-agent') || undefined
    };

    // Add to waitlist
    const result = await addToWaitlist(entry);

    if (!result) {
      throw new Error('Failed to add to waitlist');
    }

    // Return success response
    return NextResponse.json(
      { 
        success: true, 
        message: result 
          ? 'Successfully joined waitlist' 
          : 'Email already registered'
      },
      { 
        status: 200,
        headers: {
          'Cache-Control': 'no-store',
        }
      }
    );

  } catch (error) {
    console.error('❌ Waitlist route error:', error);
    
    return NextResponse.json(
      { 
        success: false,
        message: 'Internal server error',
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

/**
 * OPTIONS handler for CORS preflight
 */
export async function OPTIONS(request: NextRequest): Promise<NextResponse> {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': process.env.ALLOWED_ORIGIN || '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      'Access-Control-Max-Age': '86400', // 24 hours
    },
  });
}

/**
 * GET handler for waitlist stats (optional - for admin dashboard)
 */
export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    // Check for admin auth token
    const authHeader = request.headers.get('authorization');
    const adminToken = process.env.ADMIN_API_TOKEN;

    if (!adminToken || authHeader !== `Bearer ${adminToken}`) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Get stats from Redis
    const count = await redis.get<number>('waitlist:count') || 0;
    const emails = await redis.smembers('waitlist:emails') || [];
    
    // Get recent signups (last 10)
    const recentEmails = await redis.zrange('waitlist:timeline', -10, -1, {
      rev: true
    });

    const recentDetails = await Promise.all(
      recentEmails.map(async (email) => {
        const details = await redis.hgetall(`waitlist:details:${email}`);
        return details;
      })
    );

    return NextResponse.json({
      success: true,
      data: {
        totalCount: count,
        totalEmails: emails.length,
        recentSignups: recentDetails
      }
    });

  } catch (error) {
    console.error('GET waitlist error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}