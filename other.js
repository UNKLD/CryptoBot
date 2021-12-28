const { Telegraf } = require("telegraf");
require("dotenv").config();
const axios = require("axios");

const bot = new Telegraf(process.env.BOT_TOKEN);
bot.command(["start", "help"], (ctx) => {
  ctx.reply(
    `
    *Bot commands*
    /start - start bot
    /help - show help
    /cat - random cat image
    /cat \`<txt>\` random cat image with text
    /fortune - get fortune cookie
    `,
    { parse_mode: "Markdown" }
  );
});
bot.command("fortune", (ctx) => {
  axios
    .get(`http://yerkee.com/api/fortune`)
    .then((res) => {
      ctx.reply(res.data.fortune);
    })
    .catch((e) => {
      console.log(e.discription);
    });
});

bot.command("cat", async (ctx) => {
  let input = ctx.message.text;
  let inputArray = input.split(" ");

  if (inputArray.length == 1) {
    try {
      let res = await axios.get("https://aws.random.cat/meow");
      ctx.reply(res.data.file);
    } catch (error) {
      console.log(error);
    }
  } else {
    inputArray.shift();
    input = inputArray.join(" ");
    console.log(input);
    ctx.replyWithPhoto(`https://cataas.com/cat/says/${input}`);
  }
});

console.log("bot listining");
bot.launch();
