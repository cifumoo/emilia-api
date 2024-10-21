import { Gemini } from '../../../lib/gemini-all';

export default async function handler(req, res) {
      const { ask, image } = req.body;
      if (!ask) {
        return res.status(400).json({
          content: "Bad Request: No Query Ask Provided",
          status: 400,
          creator: "Cifumo",
        });
      }
      if (!image) {
        return res.status(400).json({
          content: "Bad Request: No Image Provided",
          status: 400,
          creator: "Cifumo",
        });
      }

      /*const bard = new Bard();
      await bard.configureGeminiImage('AIzaSyCCoVnCp5CrgI05YqtqSAHXSqFzC9SBuGU');
*/
      
      try {
    const anu = await Gemini(ask, image);
    res.status(200).json({ 
    creator: "cifumo",
    status: true, 
    content: anu 
    });
  } catch (error) {
    res.status(500).json({ 
    creator: "cifumo", 
    status: false, 
    content: 'Failed to fetch data:\n' + error
    });
  }
    }
