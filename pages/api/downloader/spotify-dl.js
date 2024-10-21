import { spotifydl } from '../../../lib/spotify';

export default async function handler(req, res) {
  const { url } = req.query;
  
  if (!url) {
    return res.json({ status: false, message: "masukin url spotify lah" });
  }

  try {
    const result = await spotifydl(url);
    res.status(200).json({ 
      creator: "cifumo",
      status: true, 
      data: result 
    });
  } catch (error) {
    res.status(500).json({ 
      creator: "cifumo", 
      status: false, 
      error: 'Failed to fetch data' 
    });
  }
}
