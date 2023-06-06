export const runtime = 'edge';

import type { NextRequest } from 'next/server';

import { fetchViewCount, updateViewCount } from '../../../lib/supabaseClient';

export default async function handler(
  req: NextRequest,
) {
  const { searchParams } = new URL(req.url);
  const slug = searchParams.get('slug');
  if (!slug) {
    return new Response(
      'invalid slug in query string',
      {
        status: 400,
        headers: {
          'content-type': 'application/json',
        },
      }
    );
  }
  const {data, error} = await fetchViewCount(slug);
  if (req.method === 'POST') {
    await updateViewCount(slug);
  }

  if (error) {
    return new Response(
      null,
      {
        status: 500,
        headers: {
          'content-type': 'application/json',
        },
      }
    );
  }

  return new Response(
    data?.view_count || 0,
    {
      status: 200,
      headers: {
        'content-type': 'application/json',
      },
    }
  );
}