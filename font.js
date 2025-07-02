const axios = require("axios");

const API = "https://raw.githubusercontent.com/VincentXJubayer/JUBAYE4/main/baseApiUrl.json";

module.exports.config = {
  name: "style",
  aliases: ["font"],
  version: "1.1",
  role: 0,
  countDowns: 5,
  author: "Jubayer",
  category: "fun",
  guide: {
    en: "style list\nstyle <number> <text>"
  }
};

module.exports.onStart = async function ({ message, args }) {
  if (!args[0]) return message.reply("style list\nstyle <number> <text>");

  if (args[0].toLowerCase() === "list") {
    try {
      const res = await axios.get(`${API}/api/font/list`);
      return message.reply(res.data || "Could not fetch font list.");
    } catch {
      return message.reply("Error loading font list.");
    }
  }

  const num = args[0];
  const text = args.slice(1).join(" ");

  if (!text || isNaN(num)) {
    return message.reply("Wrong format.❌");
  }

  try {
    const res = await axios.post(`${API}/api/font`, { number: num, text });
    const font = res.data?.data?.[num];
    if (!font) return message.reply("Font style not found.");

    const result = text.split("").map(c => font[c] || c).join("");
    return message.reply(result);
  } catch {
    return message.reply("Something went wrong. Try again later.");
  }
};
