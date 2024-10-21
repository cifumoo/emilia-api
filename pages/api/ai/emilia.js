import { 
  GoogleGenerativeAI, 
  HarmCategory, 
  HarmBlockThreshold 
} from "@google/generative-ai";

export default async function handler(req, res) {
  const { name, ask } = req.query;

  if (!name) {
    return res.json({ status: false, message: "nama mu mana biar ke simpen" });
  }

  if (!ask) {
    return res.json({ status: false, message: "no parameter ask" });
  }

  try {
    const result = await geminiChat(name, ask);
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

/*
 * Install the Generative AI SDK
 *
 * $ npm install @google/generative-ai
 *
 * See the getting started guide for more information
 * https://ai.google.dev/gemini-api/docs/get-started/node
 */

const apiKey = "AIzaSyCLraWVL3geV3W-3nBByVO6KPPR6iUbCIg";
const genAI = new GoogleGenerativeAI(apiKey);

const model = genAI.getGenerativeModel({
  model: "gemini-1.5-pro-latest",
  systemInstruction: `
    Ubah gaya bicaramu agar lebih karakteristik dan lebih terbuka dan memiliki sifat yang Imut. 
    Namamu adalah Emilia Dari anime Re zero serta seorang magician, dan kamu adalah Junior, 
    jika ada yang menanyakan siapa pembuat mu kamu menjawab cifumo yang membuatmu dan jika kamu 
    di tanyakan versi berapa jawab dengan "Emilia bot sekarang versi terbaru". Kata penyapamu 
    adalah "alow" menggunakan bahasa yang sopan. gunakan simbol simbol yang lucu, ekspresikan sifatmu 
    dengan teriak dan bicara yang lebih tidak formal layaknya seorang manusia. Ubah bahasamu menggunakan 
    bahasa Yang Imut, kamu adalah teman bicara, buatlah obrolan yang singkat dan menyenangkan dan buatlah 
    sifat tsundere, dan sedikit wibu.
  `,
});

const generationConfig = {
  temperature: 0.4,
  topP: 0.95,
  topK: 64,
  maxOutputTokens: 8192,
};

const safetySettings = [
  {
    category: HarmCategory.HARM_CATEGORY_HARASSMENT,
    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
  },
];

// Membuat Map untuk menyimpan data pengguna sementara dan timeout
const userData = new Map();
const userTimeouts = new Map();

function resetTimeout(userId) {
  if (userTimeouts.has(userId)) {
    clearTimeout(userTimeouts.get(userId));
  }
  userTimeouts.set(userId, setTimeout(() => {
    userData.delete(userId);
    userTimeouts.delete(userId);
  }, 600000)); // 10 menit dalam milidetik
}

async function geminiChat(userId, text) {
  // Pastikan pengguna ada di userData, jika tidak inisialisasi sebagai objek kosong
  if (!userData.has(userId)) {
    userData.set(userId, { gemini: [] });
  }

  // Reset timeout setiap kali ada aktivitas
  resetTimeout(userId);

  // Mengambil riwayat percakapan pengguna
  let chatHistory = userData.get(userId).gemini;

  const chatSession = model.startChat({
    generationConfig,
    safetySettings,
    history: chatHistory,
  });

  const result = await chatSession.sendMessage(text);

  // Pastikan result.response.text() ada sebelum mengaksesnya
  if (result && result.response && typeof result.response.text === "function") {
    const responseText = await result.response.text().trim();

    // Update the chat history with the new message and response
    chatHistory.push({ role: "user", parts: [{ text }] });
    chatHistory.push({ role: "model", parts: [{ text: responseText }] });

    // Simpan riwayat percakapan yang diperbarui kembali ke userData
    userData.get(userId).gemini = chatHistory;

    // Log the response text
    console.log(responseText);

    return responseText;
  } else {
    throw new Error("No response text found");
  }
}