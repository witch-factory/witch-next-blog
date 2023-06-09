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
  
  if (req.method === 'POST') {
    await updateViewCount(slug);
  }

  const {data, error} = await fetchViewCount(slug);
  
  if (error) {
    return res.status(500).json({error});
  }
  return res.status(200).json({view_count:data?.view_count || 0});
}