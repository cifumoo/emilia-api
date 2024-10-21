import { anime } from '../../../lib/anime';

export default async function handler(req, res) {
  const { url } = req.query;
  if (!url) {
    return res.status(400).json({ status: false, message: "Parameter URL tidak ada" });
  }

  try {
    const result = await anime.komiku.chapter(url);
    res.status(200).json({ creator: 'cifumo', status: true, data: result });
  } catch (error) {
    res.status(500).json({ creator: 'cifumo', status: false, error: 'Gagal mengambil data' });
  }
}