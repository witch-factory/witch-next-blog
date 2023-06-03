// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
//import type { NextApiRequest, NextApiResponse } from 'next';

export const runtime = 'edge';

type Data = {
  name: string
};

export async function handler(

) {
  return new Response('Hello, Next.js!', {
    status: 200,
  });
}
