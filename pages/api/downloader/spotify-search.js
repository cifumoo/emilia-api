import { searching } from '../../../lib/spotify';

export default async function handler(req, res) {
  const { q } = req.query;
  
  if (!q) {
    return res.json({ status: false, message: "masukin judul spotify lah" });
  }

  try {
    const result = await searching(q);
    res.status(200).json({ 
      creator: "cifumo",
      status: true, 
      data: result.data 
    });
  } catch (error) {
    res.status(500).json({ 
      creator: "cifumo", 
      status: false, 
      error: error
    });
  }
}
