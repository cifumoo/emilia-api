import axios from 'axios'
import cheerio from 'cheerio'
 
 export default async function handler(req, res) {
  const { url } = req.query;
  if (!url) {
    res.json({ status: false, message: "no parameter link" })
  }

  try {
    const result = await getSaluran(url);
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
 
 async function getSaluran(id) {
const saluran = await axios.get(id)
const $ = cheerio.load(saluran.data)
const gambar = $('._9vx6').attr('src')
const nama = $('._9vd5._9t2_').text().trim()
const ikuti = $('._9vd5._9scy').text().trim().toLowerCase().replace('saluran', '').replace('|', '').replace('channel', '').trim()
const desk = $('._9vd5._9scb').text().trim()
const url = 'https://www.whatsapp.com/channel/' + id
return { gambar, nama, ikuti, desk, url }
}