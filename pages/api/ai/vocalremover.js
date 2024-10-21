import { vocalRemover } from '../../../lib/vocalremover';

export default async function handler(req, res) {
  const { buffer } = req.query;
  if (!buffer) {
    res.json({ status: false, message: "no parameter buffer" })	
  }
  
  try {
    const result = await vocalRemover(buffer);
    res.status(200).json({ status: true, data: result });
  } catch (error) {
    res.status(500).json({ status: false, error: 'Failed to fetch data' });
  }
}
