import { download } from '../../../lib/tiktok';

export default async function handler(req, res) {
  const { url } = req.query;
  if (!url) {
    res.json({ status: false, message: "masukin url tiktoknya lah" })	
  }
  
  try {
    const result = await download(url);
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
