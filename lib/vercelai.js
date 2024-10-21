// 

// sharing ragbot it ai vercel code
// ~ fumi

//
import axios from "axios";
import cheerio from "cheerio"; // Memperbaiki kesalahan penulisan 'cherrio' menjadi 'cheerio'
import qs from "qs";

async function ragBot(message) {
  try {
    const response = await axios.post('https://ragbot-starter.vercel.app/api/chat', {
      messages: [{ role: 'user', content: message }],
      useRag: true,
      llm: 'gpt-3.5-turbo',
      similarityMetric: 'cosine'
    });
    return response.data;
  } catch (error) {
    throw error;
  }
}

export { ragBot }; // Memperbaiki kesalahan penulisan 'regBot' menjadi 'ragBot'
