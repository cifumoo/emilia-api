import wwdgpt from '../../../lib/wwdgpt';

export default async function handler(req, res) {
  const { ask } = req.query;
  if (!ask) {
    res.json({ status: false, message: "no parameter query" })	
  }
  
  try {
    const result = await wwdgpt(ask);
    res.status(200).json({ 
    creator: "cifumo",
    status: true, 
    data: result.result.content 
    });
  } catch (error) {
    res.status(500).json({ 
    creator: "cifumo", 
    status: false, 
    error: 'Failed to fetch data' 
    });
  }
}
