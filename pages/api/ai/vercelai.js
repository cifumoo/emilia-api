
import { ragBot } from '../../../lib/vercelai';

export default async function handler(req, res) {
  const { ask } = req.query;
  if (!ask) {
    res.json({ status: false, message: "no parameter ask" })	
  }
  
  try {
    const result = await ragBot(ask);
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
