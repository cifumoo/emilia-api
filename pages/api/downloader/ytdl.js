import yt from '../../../lib/ytdl';

export default async function handler(req, res) {
  const { url } = req.query;
  if (!url) {
    res.json({ status: false, message: "masukin url youtubenya lah" })	
  }
  
  try {
    const result = await yt.mp3(url);
    const result2 = await yt.mp4(url)
    res.status(200).json({ 
    creator: "cifumo",
    status: true, 
    data: {
      title: result.title,
      metadata: result.metadata,
      video: result2.media,
      audio: result.media
    }
    });
  } catch (error) {
    res.status(500).json({ 
    creator: "cifumo", 
    status: false, 
    error: 'Failed to fetch data' 
    });
  }
}
