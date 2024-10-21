import { anime } from '../../../lib/anime';

export default async function handler(req, res) {
  const { query } = req.query;
  if (!query) {
    res.json({ status: false, message: "mau nyari apa?" })	
  }
  
  try {
    const result = await anime.kiryuu.search(query);
    res.status(200).json({ creator: 'cifumo', status: true, data: result });
  } catch (error) {
    res.status(500).json({ creator: 'cifumo', status: false, error: 'Error om' });
  }
      }
