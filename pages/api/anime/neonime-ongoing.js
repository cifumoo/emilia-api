import { anime } from '../../../lib/anime';

export default async function handler(req, res) {
  const { page } = req.query;
  try {
    const result = await anime.neonime.ongoing(page);
    res.status(200).json({ creator: 'cifumo', status: true, data: result });
  } catch (error) {
    res.status(500).json({ creator: 'cifumo', status: false, error: 'Failed to fetch data' });
  }
}
