import { anime } from '../../../lib/anime';

export default async function handler(req, res) {
  try {
    const result = await anime.komikcast.latest();
    res.status(200).json({ creator: 'cifumo', status: true, data: result });
  } catch (error) {
    res.status(500).json({ creator: 'cifumo', status: false, error: 'Gagal mengambil data' });
  }
}