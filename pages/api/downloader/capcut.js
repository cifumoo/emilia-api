import { capcut } from '../../../lib/capcut';

export default async function handler(req, res) {
  const { url } = req.query;
  if (!url) {
    res.json({ status: false, message: "masukin url tiktoknya lah" })	
  }
  
  try {
    const result = await capcut(url);
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
