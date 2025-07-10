const axios = require("axios");

const baseApiUrl = "https://raw.githubusercontent.com/VincentXJubayer/JUBAYE4/main/baseApiUrl.json";

module.exports.config = {
  name: "anya",
  version: "1.0",
  hasPermssion: 0,
  permission: 0,
  credits: "Jubayer",
  description: "Talk to Anya - Get AI-powered replies",
  commandCategory: "ai",
  category: "ai",
  usages: "[question]",
  cooldowns: 5,
  countDown: 5,
  shortDescription: {
    en: "Ask Anya anything"
  },
  longDescription: {
    en: "Talk with Anya AI - Get replies using advanced smart chat"
  },
  guide: {
    en: "{pn} [your question]"
  }
};

module.exports.run = module.exports.onStart = async function ({ api, event, args, message }) {
  const input = args.join(" ").trim();

  if (!input) {
    const replyText = "❌ Please enter a question to ask Anya.";
    return message?.reply ? message.reply(replyText) : api.sendMessage(replyText, event.threadID, event.messageID);
  }

  try {
    const { data } = await axios.post(baseApiUrl, {
      question: input
    });

    const reply = data?.answer || "Sorry, no response was found.";
    if (message?.reply) {
      return message.reply(reply);
    } else {
      return api.sendMessage(reply, event.threadID, event.messageID);
    }
  } catch (err) {
    console.log("Anya command error:", err?.response?.data || err.message);
    const errorText = "⚠️ An error occurred. Please try again later.";
    return message?.reply ? message.reply(errorText) : api.sendMessage(errorText, event.threadID, event.messageID);
  }
};
