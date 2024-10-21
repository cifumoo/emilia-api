 /*
Github: https://github.com/khrlmstfa
Channel: https://whatsapp.com/channel/0029VaR0kxuKrWQqNH287b1i

Made by Mas Irull
*/

import fetch from 'node-fetch' 

async function wwdgpt(prompt) {
  try {
    const response = await fetch('https://wewordle.org/gptapi/v1/web/turbo', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 13_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.0.1 Mobile/15E148',
      },
      body: JSON.stringify({
        messages: [{
            content: "You are an AI assistant who uses Indonesian, you were created by cifumo.",
            role: "assistant"
          },
          {
            content: prompt,
            role: "user"
          }
        ]
      }),
    });
    const data = await response.text();
    const res = ({
      developer: "@Irull",
      result: data
    })
    return res;
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
}

export default wwdgpt
