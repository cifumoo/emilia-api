import axios from 'axios';
import cheerio from 'cheerio';

const pindl = (url) => {
  return new Promise(async (resolve, reject) => {
    try {
      const json = (await axios.get(url)).data;
      const assets = [];
      const $ = cheerio.load(json);
      const scriptTag = $('script[data-relay-response="true"]');

      if (scriptTag.length) {
        const jsonData = JSON.parse(scriptTag.html());
        const videoUrls = jsonData?.response?.data?.v3GetPinQuery?.data?.videos?.videoUrls;

        if (videoUrls && videoUrls.length > 0) {
          for (let i = 0; i < videoUrls.length; i++) {
            if (videoUrls[i].includes("720")) {
              assets.push(videoUrls[i]);
            }
          }
        }
      }

      if (assets.length === 0) {
        $('link').each((i, e) => {
          const resImage = $(e).attr('href');
          if (resImage && resImage.includes('.jpg')) {
            assets.push(resImage);
          }
        });
      }

      if (assets.length > 0) {
        resolve(assets[0])
      } else {
        resolve('No assets found');
      }
    } catch (e) {
      resolve(e.message);
    }
  });
};

export default pindl;