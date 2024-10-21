import { anime } from '../../../lib/anime';

export default async function handler(req, res) {
  const { url } = req.query;
  if (!url) {
    res.json({ status: false, message: "no parameter url" })	
  }
  
  try {
    const result = await anime.otakudesu.getVideoFromEps(url);
    res.status(200).json({ creator: 'cifumo', status: true, data: result });
  } catch (error) {
    res.status(500).json({ creator: 'cifumo', status: false, error: 'Failed to fetch data' });
  }
}
