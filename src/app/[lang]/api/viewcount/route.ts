import { Redis } from '@upstash/redis';
import { NextRequest, NextResponse } from 'next/server';

const redis = Redis.fromEnv();

export async function POST(request: NextRequest): Promise<NextResponse> {
  const body = await request.json() as { slug?: string };
  const slug = body.slug;

  if (!slug) {
    return new NextResponse('Slug not found', { status: 400 });
  }

  const ip = request.headers.get('X-Forwarded-For');

  if (ip) {
  // Hash the IP and turn it into a hex string
    const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(ip));
    const hash = Array.from(new Uint8Array(buf))
      .map((b) => b.toString(16).padStart(2, '0'))
      .join('');

    const isNewView = await redis.set(['deduplicate', hash, slug].join(':'), true, {
      nx: true,
      ex: 60 * 60, // 1 hour
    });
    if (!isNewView) {
      return new NextResponse(null, { status: 202 });
    }
  }

  await redis.incr(['pageviews', 'projects', slug].join(':'));

  return new NextResponse(null, { status: 202 });
}
