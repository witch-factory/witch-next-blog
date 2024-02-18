import { Redis } from '@upstash/redis';

const redis = Redis.fromEnv();

export async function GET() {

  const views = await redis.get<number>('test') ?? 0;

  return Response.json({ message: views.toString() });
}