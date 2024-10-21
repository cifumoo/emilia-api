import { animagine } from '../../../lib/imagine.js';

export default async function handler(req, res) {
  const {
    prompt,
    negative_prompt,
    sampler,
    model,
    kualitas,
    tinggi,
    lebar,
    ukuran
  } = req.query;
  if (!prompt) {
    res.json({ status: false, message: "no parameter ask" })        
  }

  try {
    const result = await animagine({
      prompt: prompt + ",masterpiece, best quality, very aesthetic, absurdres",
      negative: negative_prompt,
      sampler: sampler || "Euler a",
      style: model || "(none)",
      quality: kualitas || "(none)",
      height: tinggi || "1024",
      width: lebar || "1024",
      ratio: ukuran || "1024 x 1024"
    });
    res.status(200).json({ 
    creator: "cifumo",
    status: true, 
    data: result 
    });
  } catch (error) {
    res.status(500).json({ 
    creator: "cifumo", 
    status: false, 
    error: 'Failed to fetch data: \n' + error
    });
  }
}