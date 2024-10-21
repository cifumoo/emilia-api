import { leptonAi } from '../../../lib/leptonai';

export default async function handler(req, res) {
  const { query } = req.query;
  if (!query) {
    res.json({ status: false, message: "no parameter query" })	
  }
  
  try {
    const result = await leptonAi(query);
    res.status(200).json({ creator: "cifumo", status: true, data: result });
  } catch (error) {
    res.status(500).json({ creator: "cifumo", status: false, error: 'Failed to fetch data' });
  }
}
