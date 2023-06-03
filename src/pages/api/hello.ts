export const runtime = 'edge';

export default async function handler() {
  return new Response(
    'Hello Next',
    {
      status: 200,
      headers: {
        'content-type': 'application/json',
      },
    }
  );
}