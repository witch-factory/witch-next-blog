import { ImageResponse } from '@vercel/og';
import { NextRequest } from 'next/server';

export const config = {
  runtime: 'edge',
};
 
export default function handler (request: NextRequest) {
  try {
    const { nextUrl: { search } } = request;
    const urlSearchParams = new URLSearchParams(search);
    const params = Object.fromEntries(urlSearchParams.entries());
    const title=params.title;

    return new ImageResponse(
      (
        <div
          style={{
            fontSize: 128,
            background: 'white',
            width: '100%',
            height: '100%',
            display: 'flex',
            textAlign: 'center',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {title}
        </div>

      ),
      {
        width: 1200,
        height: 600,
      },
    );
  }
  catch (error) {
    console.error(error);
    return new Response('Failed to generate thumbnail', { status: 500 });
  }
}