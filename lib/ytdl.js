import axios from 'axios';
import yts from 'yt-search';

const getVideoId = (url) => {
  const match = url.match(/^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=|shorts\/)(?<videoId>[\w-]{11})/);
  return match ? match.groups.videoId : '';
};

const formatNumber = (number) => Number(number).toLocaleString();

const detectLang = async (text) => {
  try {
    const response = await axios.get(`https://translate.google.com/translate_a/single?client=gtx&sl=auto&tl=en&dt=t&q=${encodeURIComponent(text)}`);
    return response.data[2][0][0];
  } catch (error) {
    return 'Error detecting language';
  }
};

const Ytdl = {
  search: async (query) => {
    try {
      const results = (await yts(query)).videos;
      return {
        data: results.map(video => ({
          title: video.title,
          url: 'https://youtu.be/' + video.videoId,
          img: video.image,
          author: {
            name: video.author.name,
            url: video.author.url
          }
        }))
      };
    } catch (error) {
      return {
        status: false,
        msg: 'Data tidak dapat ditemukan!',
        err: error.message
      };
    }
  },

  mp3: async (url) => {
    try {
      const videoId = getVideoId(url);
      const videoUrl = `https://youtu.be/${videoId}`;

      // Coba API pertama
      try {
        const media = await youtube(url)
        const ling = await media.download.dl.mp3?.["mp3"]()

        const info = await getInfo(videoId);
        return {
          title: info.title || '',
          metadata: {
            duration: info.duration || '',
            thumbnail: info.thumbnail || '',
            views: formatNumber(info.view) || '',
            description: info.desc || '',
            channel: info.channel || ''
          },
          url: videoUrl,
          media: ling.url,
        };
      } catch (error) {
        console.log("Gagal menggunakan API pertama:", error.message);

        // Coba API kedua jika API pertama gagal
        const mp32 = await axios.get(`https://api.maelyn.tech/api/youtube/audio?url=${url}&apikey=${APIKeys[APIs['maelyn']]}`);
        const info = await getInfo(videoId);

        return {
          title: info.title || '',
          metadata: {
            duration: info.duration || '',
            thumbnail: info.thumbnail || '',
            views: formatNumber(info.view) || '',
            description: info.desc || '',
            channel: info.channel || ''
          },
          url: videoUrl,
          media: mp32.data.result.url,
        };
      }
    } catch (error) {
      return {
        status: false,
        msg: 'Gagal saat mengambil data!',
        err: error.message
      };
    }
  },

  mp4: async (url) => {
    try {
      const videoId = getVideoId(url);
      const videoUrl = `https://youtu.be/${videoId}`;

      // Coba API pertama
      try {
        
        const media = await youtube(url)
        const ling = await media.download.dl.mp4?.["auto"]()
        const info = await getInfo(videoId);

        return {
          title: info.title || '',
          metadata: {
            duration: info.duration || '',
            thumbnail: info.thumbnail || '',
            views: formatNumber(info.view) || '',
            description: info.desc || '',
            channel: info.channel || ''
          },
          url: videoUrl,
          media: ling.url,
        };
      } catch (error) {
        console.log("Gagal menggunakan API pertama:", error.message);

        // Coba API kedua jika API pertama gagal
        const mp42 = await axios.get(`https://api.maelyn.tech/api/youtube/video?url=${url}&apikey=${APIKeys[APIs['maelyn']]}`);
        const info = await getInfo(videoId);

        return {
          title: info.title || '',
          metadata: {
            duration: info.duration || '',
            thumbnail: info.thumbnail || '',
            views: formatNumber(info.view) || '',
            description: info.desc || '',
            channel: info.channel || ''
          },
          url: videoUrl,
          media: await toBuffer(mp42.data.result.url),
        };
      }
    } catch (error) {
      return {
        status: false,
        msg: 'Gagal saat mengambil data!',
        err: error.message
      };
    }
  }
};

// Fungsi tambahan
async function getFileSize(url) {
  try {
    const res = await axios.head(url);
    return parseInt(res.headers["content-length"], 10);
  } catch (err) {
    return 0;
  }
}

async function toBuffer(url) {
  try {
    const response = await axios.get(url, {
      responseType: "arraybuffer",
    });
    return Buffer.from(response.data, "binary");
  } catch (error) {
    console.error("Terjadi kesalahan:", error);
    throw error;
  }
}

function durasi(isoDuration) {
  const regex = /PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/;
  const matches = isoDuration.match(regex);

  const hours = parseInt(matches[1]) || 0;
  const minutes = parseInt(matches[2]) || 0;
  const seconds = parseInt(matches[3]) || 0;

  const formattedTime =
    (hours > 0 ? hours + ":" : "") +
    (minutes < 10 && hours > 0 ? "0" : "") + minutes +
    ":" +
    (seconds < 10 ? "0" : "") + seconds;

  return formattedTime;
}

async function getInfo(id) {
  const url = `https://www.googleapis.com/youtube/v3/videos?id=${id}&key=AIzaSyD8CUcwY40UbZW7CGvRIFSEpIRIZTN9fqw&part=snippet,contentDetails,statistics,status`;

  const response = await axios.get(url);
  const js = response.data;

  return {
    title: js.items[0].snippet.title,
    thumbnail: js.items[0].snippet.thumbnails.high.url,
    desc: js.items[0].snippet.description,
    tags: js.items[0].snippet.tags,
    channel: js.items[0].snippet.channelTitle,
    view: js.items[0].statistics.viewCount,
    duration: durasi(js.items[0].contentDetails.duration)
  };
}

function toMenit(detik) {
  const jam = Math.floor(detik / 3600);
  const menit = Math.floor((detik % 3600) / 60);
  const sisaDetik = detik % 60;
  if (jam > 0) {
    return `${jam}:${String(menit).padStart(2, '0')}:${String(sisaDetik).padStart(2, '0')}`;
  } else {
    return `${menit}:${String(sisaDetik).padStart(2, '0')}`;
  }
}

var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};

/**
 * Scraped By Kaviaann
 * Protected By MIT LICENSE
 * Whoever caught removing wm will be sued
 * @description Any Request? Contact me : vielynian@gmail.com
 * @author Kaviaann 2024
 * @copyright https://whatsapp.com/channel/0029Vac0YNgAjPXNKPXCvE2e
 */
function youtube(data) {
    return __awaiter(this, void 0, void 0, function* () {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                data = data.trim();
                !data &&
                    (() => {
                        return reject("Enter either a youtube link for downloading, or query for searching");
                    })();
                const yt = /youtu(\.)?be/gi.test(data);
                if (!yt) {
                    const d = yield yts(data).then((v) => v.videos);
                    return resolve({
                        type: "search",
                        query: data,
                        total: d.length || 0,
                        videos: d.map(({ videoId, views, url, title, description, image, thumbnail, seconds, timestamp, ago, author, }) => {
                            return {
                                title,
                                id: videoId,
                                url,
                                media: {
                                    thumbnail: thumbnail || "",
                                    image: image,
                                },
                                description,
                                duration: {
                                    seconds,
                                    timestamp,
                                },
                                published: ago,
                                views,
                                author,
                            };
                        }),
                    });
                }
                else {
                    const id = ((_a = /(?:youtu\.be\/|youtube\.com(?:\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=|shorts\/)|youtu\.be\/|embed\/|v\/|m\/|watch\?(?:[^=]+=[^&]+&)*?v=))([^"&?\/\s]{11})/gm.exec(data)) === null || _a === void 0 ? void 0 : _a[1]) || "";
                    if (!id)
                        return reject("Enter valid youtube video link!");
                    const { title, description, url, videoId, seconds, timestamp, views, genre, uploadDate, ago, image, thumbnail, author, } = yield yts({
                        videoId: id,
                    });
                    const headers = {
                        Accept: "*/*",
                        Origin: "https://id-y2mate.com",
                        Referer: "https://id-y2mate.com/",
                        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/129.0.0.0 Safari/537.36",
                        "Sec-Ch-Ua-Platform-Version": '"15.0.0"',
                        "Sec-Ch-Ua-Bitness": "64",
                        "Sec-Ch-Ua-Model": "",
                        "Sec-Ch-Ua-Mobile": "?0",
                        "Sec-Ch-Ua-Arch": "x86",
                        "X-Requested-With": "XMLHttpRequest",
                        "Sec-Ch-Ua-Full-Version": "129.0.6668.90",
                        "Sec-Ch-Ua-Full-Version-List": '"Google Chrome";v="129.0.6668.90", "Not=A?Brand";v="8.0.0.0", "Chromium";v="129.0.6668.90"',
                    };
                    const r = yield axios
                        .post("https://id-y2mate.com/mates/analyzeV2/ajax", new URLSearchParams({
                        k_query: `https://youtube.com/watch?v=${id}`,
                        k_page: "home",
                        hl: "",
                        q_auto: "0",
                    }), {
                        headers,
                    })
                        .then((v) => v.data);
                    if (!r)
                        return reject(new Error("Fail to get video & audio"));
                    const d = {
                        mp3: {},
                        mp4: {},
                    };
                    yield new Promise((res) => {
                        for (let i of Object.values(r.links.mp4)) {
                            Object.assign(d.mp4, {
                                [i.q]: () => __awaiter(this, void 0, void 0, function* () {
                                    return new Promise((res, rej) => __awaiter(this, void 0, void 0, function* () {
                                        try {
                                            const r = yield axios
                                                .post("https://id-y2mate.com/mates/convertV2/index", new URLSearchParams({
                                                vid: id,
                                                k: i.k,
                                            }), {
                                                headers: Object.assign(Object.assign({}, headers), { Referer: headers.Referer + id }),
                                            })
                                                .then((v) => v.data);
                                            if (!r || r.status !== "ok")
                                                return rej(new Error("Fail to convert video"));
                                            return res({
                                                size: i.size,
                                                format: i.f,
                                                url: r.dlink,
                                            });
                                        }
                                        catch (e) {
                                            return rej(e);
                                        }
                                    }));
                                }),
                            });
                        }
                        for (let i of Object.values(r.links.mp3)) {
                            Object.assign(d.mp3, {
                                [i.f]: () => __awaiter(this, void 0, void 0, function* () {
                                    return new Promise((res, rej) => __awaiter(this, void 0, void 0, function* () {
                                        try {
                                            const r = yield axios
                                                .post("https://id-y2mate.com/mates/convertV2/index", new URLSearchParams({
                                                vid: id,
                                                k: i.k,
                                            }), {
                                                headers: Object.assign(Object.assign({}, headers), { Referer: headers.Referer + id }),
                                            })
                                                .then((v) => v.data);
                                            if (!r || r.status !== "ok")
                                                return rej(new Error("Fail to convert video"));
                                            return res({
                                                size: i.size,
                                                format: i.f,
                                                url: r.dlink,
                                            });
                                        }
                                        catch (e) {
                                            return rej(e);
                                        }
                                    }));
                                }),
                            });
                        }
                        res();
                    });
                    return resolve({
                        type: "download",
                        download: {
                            title,
                            description,
                            url,
                            id: videoId,
                            duration: {
                                seconds,
                                timestamp,
                            },
                            views,
                            genre,
                            releaseDate: uploadDate,
                            published: ago,
                            media: {
                                thumbnail,
                                image,
                            },
                            author,
                            dl: yield d,
                        },
                    });
                }
            }
            catch (e) {
                return reject(e);
            }
        }));
    });
}

export default Ytdl;



