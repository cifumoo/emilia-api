import hd from '../../../lib/upscale';
import axios from 'axios';

export default async function handler(req, res) {
  const { url, scale, anime } = req.query;
  if (!url) {
    res.json({ status: false, message: "no parameter url" })	
  }
  
  try {
    const img = await toBuffer(url)
    const result = await hd(img, scale || 2, anime || false);
    res.status(200).json({ 
    creator: "cifumo",
    status: true, 
    data: result.image
    });
  } catch (error) {
    res.status(500).json({ 
    creator: "cifumo", 
    status: false, 
    error: 'Failed to fetch data' 
    });
  }
  async function toBuffer(url) {
  try {
    const response = await axios.get(url, {
      responseType: "arraybuffer", // Pastikan respons diterima sebagai buffer
    });
    const buffer = Buffer.from(response.data, "binary");
    return buffer;
  } catch (error) {
    console.error("Terjadi kesalahan:", error);
    throw error;
  }
}
}
