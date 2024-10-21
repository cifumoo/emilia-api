

import axios from 'axios';
import cheerio from 'cheerio'

const languageUrls = {
  en: "https://mobile-legends.fandom.com/wiki/${namachar}/Audio",
  id: "https://mobile-legends.fandom.com/wiki/${namachar}/Audio/id",
  ja: "https://mobile-legends.fandom.com/wiki/${namachar}/Audio/ja",
  zh: "https://mobile-legends.fandom.com/wiki/${namachar}/Audio/zh"
};

async function voice(namachar, language, soundId) {
  try {
  const baseUrl = languageUrls[language].replace('${namachar}', namachar);
  if (!baseUrl) {
    throw new Error("Language not supported");
  }

  // Fetch the page data without soundId to verify if the soundId exists
  const response = await axios.get(baseUrl);
  const $ = cheerio.load(response.data);

  // Get list of valid sound_ids from the tabs
  const validSoundIds = []
  $('.wds-tabs__tab').each((i, tabElement) => {
    const hash = $(tabElement).data('hash');
    validSoundIds.push(hash);
  });

  // Check soundId validity across all languages
  if (soundId && !validSoundIds.includes(soundId)) {
    const allValidSoundIds = {};
    for (let lang in languageUrls) {
      const langUrl = languageUrls[lang].replace('${namachar}', namachar);
      const langResponse = await axios.get(langUrl);
      const $lang = cheerio.load(langResponse.data);
      const langValidSoundIds = [];
      $lang('.wds-tabs__tab').each((i, tabElement) => {
        const hash = $lang(tabElement).data('hash');
        langValidSoundIds.push(hash);
      });
      allValidSoundIds[lang] = langValidSoundIds;
    }
    return { error: "Invalid sound_id", validSoundIds: allValidSoundIds };
  }

  // Build URL with or without soundId
  const url = soundId ? `${baseUrl}#${soundId}` : baseUrl;
  const audioResponse = await axios.get(url);
  const $audio = cheerio.load(audioResponse.data);

  const audioData = [];
  const tabs = [];

  // Get list of audio tabs
  $('.wds-tabs__tab-label a').each((i, tabElement) => {
    const tabName = $(tabElement).text().trim();
    tabs.push({ index: i + 1, tab_name: tabName });
  });

  // Get audio data
  $('audio').each((i, audioElement) => {
    const audioUrl = $(audioElement).attr('src');
    const description = $(audioElement).closest('span').parent().text().split('"')[1];
    audioData.push({ number: i + 1, audio_url: audioUrl, description });
  });

  return audioData;
  } catch(e) {
    return e.message
  }
}




async function info(charname) {
    try {
        const url = `https://mobile-legends.fandom.com/wiki/${charname}`;
        const { data } = await axios.get(url);
        const $ = cheerio.load(data);

        const heroData = {};

        // Get hero name and quote
        const nameQuoteElem = $('div[style="line-height:0.80"]').html();
        if (nameQuoteElem) {
            const nameQuote = nameQuoteElem.split('<br>');
            heroData.name = nameQuote[0]?.trim() || 'N/A';
            heroData.quote = $(nameQuote[1]).text().trim() || 'N/A';
        } else {
            heroData.name = 'N/A';
            heroData.quote = 'N/A';
        }

        // Get hero images
        heroData.images = {};
        heroData.images.portrait = $('.pi-image-collection .wds-is-current img').attr('src') || 'N/A';
        heroData.images.model = $('.pi-image-collection img[title="Model"]').attr('src') || 'N/A';

        // Get hero ratings
        heroData.ratings = {};
        $('div[data-source="durability"]').each((_, element) => {
            const ratingName = $(element).find('.pi-data-label').text().trim();
            const ratingValue = $(element).find('.bar').text().trim();
            heroData.ratings[ratingName] = ratingValue;
        });

        // Get voice actors
        heroData.voiceActors = {};
        $('div[data-source="en_va"]').each((_, element) => {
            const language = 'English';
            const actor = $(element).find('.pi-data-value a').text().trim() || $(element).find('.pi-data-value').text().trim();
            heroData.voiceActors[language] = actor;
        });
        $('div[data-source="ja_va"]').each((_, element) => {
            const language = 'Japanese';
            const actor = $(element).find('.pi-data-value a').text().trim() || $(element).find('.pi-data-value').text().trim();
            heroData.voiceActors[language] = actor;
        });
        $('div[data-source="id_va"]').each((_, element) => {
            const language = 'Indonesian';
            const actor = $(element).find('.pi-data-value').text().trim();
            heroData.voiceActors[language] = actor;
        });
        $('div[data-source="es_va"]').each((_, element) => {
            const language = 'Spanish';
            const actor = $(element).find('.pi-data-value a').text().trim() || $(element).find('.pi-data-value').text().trim();
            heroData.voiceActors[language] = actor;
        });

        // Get additional data
        heroData.releaseDate = $('div[data-source="release_date"] .pi-data-value').text().trim();
        heroData.role = $('div[data-source="role"] .pi-data-value').text().trim();
        heroData.specialty = $('div[data-source="specialty"] .pi-data-value').text().trim();
        heroData.lane = $('div[data-source="lane"] .pi-data-value').text().trim();
        heroData.price = $('div[data-source="price"] .pi-data-value').text().trim();
        heroData.resource = $('div[data-source="resource"] .pi-data-value').text().trim();
        heroData.dmgType = $('div[data-source="dmg_type"] .pi-data-value').text().trim();
        heroData.atkType = $('div[data-source="atk_type"] .pi-data-value').text().trim();

        return heroData;
    } catch (error) {
        console.error(error);
        return null;
    }
}

export { info, voice }