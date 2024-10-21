import { Pinterest } from '../../../lib/pinterest';

export default async function handler(req, res) {
  const { url } = req.query;
  if (!url) {
    res.json({ status: false, message: "masukin url pin lah" })        
  }

  try {
    const anu = new Pinterest()
    const result = await anu.download(url);
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