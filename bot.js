require('dotenv').config();
// const HF_MODEL = 'HuggingFaceH4/zephyr-7b-beta'; // you can change model
const TelegramBot = require('node-telegram-bot-api');
const axios = require('axios');

const TELEGRAM_TOKEN = process.env.TELEGRAM_TOKEN;
const HF_TOKEN = process.env.HF_TOKEN;
const HF_MODEL = process.env.HF_MODEL;


// Create bot
const bot = new TelegramBot(TELEGRAM_TOKEN, { polling: true });

// Handle messages
bot.on('message', async (msg) => {
  const chatId = msg.chat.id;
  const userInput = msg.text;

  // Trim user input to avoid delays
  // const trimmedInput = userInput.slice(0, 200);

  // Send thinking message
  await bot.sendMessage(chatId, '🤖 Thinking... please wait a moment');

  try {
    // Hugging Face API call
    const response = await axios.post(
      `https://api-inference.huggingface.co/models/${HF_MODEL}`,
      { inputs: trimmedInput },
      {
        headers: {
          Authorization: `Bearer ${HF_TOKEN}`,
        },
      }
    );

    const botReply =
      response.data?.[0]?.generated_text || '🤖 Sorry, I could not generate a response.';

    // Send response back to Telegram
    bot.sendMessage(chatId, botReply);

  } catch (error) {
    console.error(error?.response?.data || error.message);
    bot.sendMessage(chatId, '❌ Error fetching response from Hugging Face.');
  }
});
