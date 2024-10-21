import { anime } from '../../../lib/anime';

export default async function handler(req, res) {
  const { url } = req.query;
  if (!url) {
    return res.status(400).json({ creator: 'cifumo', status: false, error: 'URL is required' });
  }
  try {
    const result = await anime.neonime.getdata(url);
    res.status(200).json({ creator: 'cifumo', status: true, data: result });
  } catch (error) {
    res.status(500).json({ creator: 'cifumo', status: false, error: 'Failed to fetch data' });
  }
}
