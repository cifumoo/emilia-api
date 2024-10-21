// pages/api/komiku/search.js
import { anime } from '../../../lib/anime';

export default async function handler(req, res) {
  const { query } = req.query;
  if (!query) {
    res.json({ status: false, message: "no parameter query" })	
  }
  
  try {
    const result = await anime.nekopoi.search(query);
    res.status(200).json({ status: true, data: result });
  } catch (error) {
    res.status(500).json({ status: false, error: 'Failed to fetch data' });
  }
}