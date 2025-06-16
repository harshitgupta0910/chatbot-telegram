require('dotenv').config();
const TelegramBot = require('node-telegram-bot-api');
const axios = require('axios');
const express = require('express');

// Keep-alive server
const app = express();
app.get('/', (_, res) => res.send('🤖 DeepSeek R1 bot is live'));
app.listen(process.env.PORT || 3000, () => {
  console.log('✅ Express server running...');
});

// Load credentials
const TELEGRAM_TOKEN = process.env.TELEGRAM_TOKEN;
const OR_TOKEN = process.env.HF_TOKEN;
const OR_MODEL = process.env.HF_MODEL;

// Start bot
const bot = new TelegramBot(TELEGRAM_TOKEN, { polling: true });

bot.on('message', async (msg) => {
  const chatId = msg.chat.id;
  const userInput = msg.text;

  await bot.sendMessage(chatId, '🤖 DeepSeek is thinking...');

  try {
    const response = await axios.post(
      'https://openrouter.ai/api/v1/chat/completions',
      {
        model: OR_MODEL,
        messages: [{ role: 'user', content: userInput }],
      },
      {
        headers: {
          Authorization: `Bearer ${OR_TOKEN}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': 'https://yourdomain.com',
          'X-Title': 'TelegramDeepSeekBot',
        },
      }
    );

    const reply = response.data.choices?.[0]?.message?.content?.trim() || '⚠️ No reply from DeepSeek.';
    await bot.sendMessage(chatId, reply);
  } catch (error) {
    console.error('❌ API Error:', error?.response?.data || error.message);
    await bot.sendMessage(chatId, '❌ Failed to get response from DeepSeek.');
  }
});
