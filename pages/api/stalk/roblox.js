import stalk from '../../../lib/stalkroblox';

export default async function handler(req, res) {
  const { q } = req.query;
  if (!q) {
    res.json({ status: false, message: "Mana namanya" })	
  }
  
  try {
    const result = await stalk(q);
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
