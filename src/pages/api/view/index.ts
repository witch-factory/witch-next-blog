import { NextApiRequest, NextApiResponse } from 'next';

import { fetchViewCount, updateViewCount } from '../../../lib/supabaseClient';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const slug = req.query?.slug?.toString();
  
  if (!slug) {
    return res.status(400).json({error: 'invalid slug in query string'});
  }
  const {data, error} = await fetchViewCount(slug);
  if (req.method === 'POST') {
    await updateViewCount(slug);
  }

  if (error) {
    return res.status(500).json({error});
  }

  return res.status(200).json({data:data || 0});
}