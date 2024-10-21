import axios from 'axios';

/**
 * Generate a random ID with the specified length
 * @param {number} length - The length of the random ID to be generated.
 * @returns {string} - The generated random ID.
 */
function generateRandomID(length) {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
  let randomID = '';
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    randomID += characters.charAt(randomIndex);
  }
  return randomID;
}

/**
 * Scraper By QanyPaw
 * Forbidden to sell and delete my wm, respect the creator
 */

const api = axios.create({
  baseURL: 'https://search.lepton.run/api/',
  headers: {
    'Content-Type': 'application/json'
  }
});

/**
 * Scraper By QanyPaw
 * Forbidden to sell and delete my wm, respect the creator
 */

/**
 * Send a query to the Lepton AI API and retrieve the LLM response.
 * @param {string} query - The query to send to the API.
 * @returns {Promise<string>} - The LLM response.
 * @throws {Error} - Throws an error if the response is invalid or there is a network issue.
 */
async function leptonAi(query) {
  try {
    const rid = generateRandomID(10);
    const postData = { query, rid };
    const response = await api.post('query', postData);
    
    const llmResponseRegex = /__LLM_RESPONSE__([\s\S]*?)__RELATED_QUESTIONS__/;
    const llmResponseMatch = response.data.match(llmResponseRegex);

    if (llmResponseMatch && llmResponseMatch[1]) {
      let llmResponse = llmResponseMatch[1].trim();
      return llmResponse;
    } else {
      throw new Error("No LLM response found in the server response.");
    }
  } catch (error) {
    throw new Error('Error fetching LLM response: ' + error.message);
  }
}

export { leptonAi };
