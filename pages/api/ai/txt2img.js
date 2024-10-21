import { ai } from '../../../lib/txt2img';

export default async function handler(req, res) {
  const { q } = req.query;
  if (!ask) {
    res.json({ status: false, message: "Mau generate apa om?" })	
  }
  
  try {
    const result = await ai.generate.txt2img(q);
    res.status(200).json({ 
    creator: "cifumo",
    status: true, 
    data: result 
    });
  } catch (error) {
    res.status(500).json({ 
    creator: "cifumo", 
    status: false, 
    error: error.message
    });
  }
}
