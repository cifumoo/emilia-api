import { BingImageCreator } from '../../../lib/bing-image';

export default async function handler(req, res) {
  const { p, cookie } = req.query;
  if (!p) {
    res.json({ 
      creator: "cifumo",
      status: false,
      message: "no parameter prompt"
    })	
  }
  
  if (!cookie) {
    res.json({ 
      creator: "cifumo",
      status: false,
      message: "no parameter cookie"
    })
  }
  
  try {
    const image = new BingImageCreator({ cookie: cookie });
      
    const result = await image.createImage(p);
    res.status(200).json({ 
    creator: 'cifumo',
    status: true, 
    data: result
    });
  } catch (error) {
    res.status(500).json({ 
    creator: 'cifumo',
    status: false,
    error: error.message
    });
  }
}
