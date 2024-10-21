import { anime } from '../../../lib/anime'

export default async function handler(req, res) {
  const { query } = req
  const results = await anime.neonime.search(query)
  try {
    const result = await anime.nekopoi.search(query);
    res.status(200).json({ creator: 'cifumo', status: true, data: result });
  } catch (error) {
    res.status(500).json({ creator: 'cifumo', status: false, error: 'Failed to fetch data' });
  }
}