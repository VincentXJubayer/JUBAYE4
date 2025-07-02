const axios = require("axios");

const baseApiUrl = "https://raw.githubusercontent.com/VincentXJubayer/JUBAYE4/main/baseApiUrl.json";

module.exports = {
  config: {
    name: "anya",
    aliases: [],
    version: "1.0",
    author: "Jubayer",
    countDown: 5,
    role: 0,
    shortDescription: {
      en: "Get smart replies from Anya"
    },
    longDescription: {
      en: "Talk to Anya - Ask anything and receive a reply powered by AI"
    },
    category: "ai",
    guide: {
      en: "{pn} [your question]"
    }
  },

  onStart: async function ({ message, args }) {
    const input = args.join(" ").trim();

    if (!input) {
      return message.reply("❌ Please enter a question to ask Anya.");
    }

    try {
      const { data } = await axios.post(baseApiUrl, {
        question: input
      });

      const reply = data?.answer || "Sorry, no response was found.";
      message.reply(reply);
    } catch (err) {
      console.log("Anya command error:", err?.response?.data || err.message);
      message.reply("⚠️ An error occurred. Please try again later.");
    }
  }
};
