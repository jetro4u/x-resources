// app/api/admin/export-waitlist/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { redis } from '../../../lib/redis'; // Import redis client from redis.ts

export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    // Auth check - verify admin token
    const authHeader = request.headers.get('authorization');
    const adminToken = process.env.ADMIN_API_TOKEN;

    if (!adminToken || authHeader !== `Bearer ${adminToken}`) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Get all emails from the set
    const emails = await redis.smembers('waitlist:emails') || [];
    
    // Fetch details for each email
    const allDetails = await Promise.all(
      emails.map(async (email) => {
        return await redis.hgetall(`waitlist:details:${email}`);
      })
    );

    // Convert to CSV
    const csv = [
      'email,timestamp,ip,userAgent,status',
      ...allDetails.map(d => 
        `${d?.email || ''},${d?.timestamp || ''},${d?.ip || ''},${d?.userAgent || ''},${d?.status || 'pending'}`
      )
    ].join('\n');

    return new NextResponse(csv, {
      status: 200,
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': 'attachment; filename="waitlist.csv"'
      }
    });
  } catch (error) {
    console.error('Export error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}