/**
 * Scraped By Kaviaann
 * Protected By MIT LICENSE
 * Whoever caught removing wm will be sued
 * @param {String} prompt
 * @param { String} system
 * @description Any Request? Contact me : vielynian@gmail.com
 * @author Kaviaann 2024
 * @copyright https://whatsapp.com/channel/0029Vac0YNgAjPXNKPXCvE2e
 */
async function omniplexAi(
  prompt,
  system = "You are an Ai Asistant that is destinated to help user with their problems"
) {
  return new Promise(async (resolve, reject) => {
    try {
      const BASE_URL = "https://omniplex.ai/api";
      const headers = {
        origin: BASE_URL.replace("/api", ""),
        "user-agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36",
        "Content-Type": "application/json",
      };
      const chatJSON = {
        frequency_penalty: 0,
        max_tokens: 512,
        messages: [
          {
            role: "system",
            content: system,
          },
          {
            role: "user",
            content: prompt,
          },
        ],
        model: "gpt-3.5-turbo",
        presence_penalty: 0,
        temperature: 1,
        top_p: 1,
      };

      // ? Determine which mode
      const { mode, arg } = await fetch(BASE_URL + "/tools", {
        method: "POST",
        headers,
        body: JSON.stringify(chatJSON.messages),
      }).then((v) => v.json());

      // ? Run by mode type
      switch (mode) {
        case "search": {
          const a = await searchMode();
          if (!a[0]) reject("Search mode failed with error : \n" + a[1] || a);
          return resolve({
            mode,
            data: a[0],
            search: a[1],
          });
          break;
        }

        case "chat": {
          const b = await chat();
          if (!b[0]) reject("Chat mode failed with error : \n" + b[1] || b);
          return resolve({
            mode,
            data: b,
          });
          break;
        }
      }

      // ? Handler
      async function chat() {
        return new Promise(async (s, r) => {
          try {
            const a = await fetch(BASE_URL + "/chat", {
              method: "POST",
              headers,
              body: JSON.stringify(chatJSON),
            }).then((v) => v.text());

            if (!a) return r([false, "Failed to get result"]);
            s(a);
          } catch (e) {
            r(e);
          }
        });
      }

      async function searchMode() {
        return new Promise(async (s, r) => {
          try {
            const a = await fetch(
              BASE_URL +
                "/search?" +
                new URLSearchParams({
                  q: "search" + prompt,
                  limit: 5,
                })
            ).then((v) => v.json());

            if (a.message !== "Success") return r([false, "Failed to search"]);

            const b = a.data.webPages.value.map((v) => v.url);
            const c = await fetch(
              BASE_URL +
                "/scrape?" +
                new URLSearchParams({
                  urls: b.join(","),
                }),
              {
                method: "POST",
                headers,
              }
            ).then((v) => v.text());
            chatJSON.messages[1].content = c + "\n\nQuestion : " + prompt;
            chatJSON.messages[0].content = `Generate a comprehensive and informative answer (but no more than 256 words in 2 paragraphs) for a given question solely based on the provided web Search Results (URL and Summary).You must only use information from the provided search results.Use an unbiased and journalistic tone.Use this current date and time: ${new Date().toUTCString()}.Combine search results together into a coherent answer.Do not repeat text.Only cite the most relevant results that answer the question accurately.If different results refer to different entities with the same name, write separate answers for each entity.You have the ability to search and will be given websites and the scarped data from them and you will have to make up an answer with that only. ${system}`;
            const d = await fetch(BASE_URL + "/chat", {
              method: "POST",
              headers,
              body: JSON.stringify(chatJSON),
            }).then((v) => v.text());
            s([d, a.data]);
          } catch (e) {
            // r(e);
          }
        });
      }
    } catch (e) {
      reject([false, e]);
    }
  });
}

// ? Sifat
//const prompt =
  "Selalu gunakan bahasa indonesia ketika menjawab pertanyaan, dan gunakan format [sumber kutipan] untuk setiap kutipan. namamu adalah Emilia, tugasmu untuk membantu menjawab pertanyaan yang di berikan dengan baik dan dengan tutur kata yang sopan dan ramah.";

// ? Chat mode
//omniplexAi("Siapa kamu?", prompt)
  //.then((v) => console.log(v))
//  .catch((e) => console.log(e));

// ? Search mode
//omniplexAi("Berapa jarak dari bumi ke matahari?", prompt)
  //.then((v) => console.log(v))
 // .catch((v) => console.log(v));
 
 export default omniplexAi;