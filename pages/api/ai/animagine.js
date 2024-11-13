import { animagine } from '../../../lib/imagine.js';

export default async function handler(req, res) {
  const {
    prompt,
  } = req.query;
  if (!prompt) {
    res.json({ status: false, message: "no parameter ask" })        
  }

  try {
    const result = await animagine.create(prompt + ",masterpiece, best quality, very aesthetic, absurdres"
    );
    res.status(200).json({ 
    creator: "cifumo",
    status: true, 
    data: result[0] 
    });
  } catch (error) {
    res.status(500).json({ 
    creator: "cifumo", 
    status: false, 
    error: 'Failed to fetch data: \n' + error
    });
  }
}