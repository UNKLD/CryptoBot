const { Telegraf } = require("telegraf");

let path = process.env.CONFIG_FILE_PATH || ".env";
require("dotenv").config({ path: path });
const axios = require("axios");

const bot = new Telegraf(process.env.BOT_TOKEN);
const apiKey = process.env.API_KEY;

bot.command("start", (ctx) => {
  sendStartMessage(ctx);
});
bot.action("menu", (ctx) => {
  ctx.deleteMessage();
  sendStartMessage(ctx);
});
function sendStartMessage(ctx) {
  let startMessage = "Welcome, This bot povides you with Cryptocurrency information";
  ctx.reply(startMessage, {
    reply_markup: {
      inline_keyboard: [
        [{ text: "Crypto Prices", callback_data: "price" }],
        [{ text: "CoinMarketCap", url: "https://coinmarketcap.com/" }],
      ],
    },
  });
}
bot.action("price", (ctx) => {
  ctx.deleteMessage();
  let pMessage = "Get crypto price information, Select one of the following below";
  bot.telegram.sendMessage(ctx.chat.id, pMessage, {
    reply_markup: {
      inline_keyboard: [
        [
          { text: "BTC", callback_data: "BTC" },
          { text: "ETH", callback_data: "ETH" },
        ],
        [
          { text: "BCH", callback_data: "BCH" },
          { text: "LTC", callback_data: "LTC" },
        ],
        [{ text: "Back to Main menu", callback_data: "menu" }],
      ],
    },
  });
});

let priceActionList = ["BTC", "ETH", "BCH", "LTC"];
bot.action(priceActionList, async (ctx) => {
  let symbol = ctx.match[0];
  try {
    let res = await axios(
      `https://min-api.cryptocompare.com/data/pricemultifull?fsyms=${symbol}&tsyms=USD&api_key=${apiKey} `
    );
    let data = await res.data.DISPLAY[symbol].USD;

    let message = `
    Symbol: ${symbol}
Price: ${data.PRICE}
Open: ${data.OPENDAY}
High: ${data.HIGHDAY}
Low: ${data.LOWDAY}
Supply: ${data.SUPPLY}
Market Cap: ${data.MKTCAP}
    `;

    ctx.deleteMessage();
    ctx.reply(message, {
      reply_markup: {
        inline_keyboard: [[{ text: "Back to prices", callback_data: "price" }]],
      },
    });
  } catch (err) {
    console.log(err);
    ctx.reply("Error Encountered");
  }
});
console.log("bot listning");
bot.launch();
