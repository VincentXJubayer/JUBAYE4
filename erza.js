const axios = require("axios");

let jubayerUrl = "";
axios.get("https://raw.githubusercontent.com/VincentXJubayer/JUBAYE4/main/baseApiUrl.json")
  .then(res => {
    jubayerUrl = res.data.jubayer;
  })
  .catch(err => {
    console.error("Failed to load Erza base URL:", err.message);
  });

module.exports = {
  config: {
    name: "erza",
    version: "1.0",
    author: "Jubayer",
    countDown: 3,
    role: 0,
    shortDescription: "Ask Erza (AI powered)",
    longDescription: "Send a question to Erza and receive an intelligent response using Gemini AI.",
    category: "ai",
    guide: "{pn} <your question>"
  },

  onStart: async function ({ api, event, args }) {
    const question = args.join(" ");
    const name = event.senderID;

    if (!question) {
      return api.sendMessage("❗ Please provide a question.", event.threadID, event.messageID);
    }

    if (!jubayerUrl) {
      return api.sendMessage("❌ Erza is not ready yet. Please try again shortly.", event.threadID, event.messageID);
    }

    try {
      const response = await axios.get(`${jubayerUrl}?ask=${encodeURIComponent(question)}&name=${name}`);

      if (!response.data.status) {
        return api.sendMessage(`❌ ${response.data.message || "No answer returned."}`, event.threadID, event.messageID);
      }

      return api.sendMessage(response.data.answer, event.threadID, event.messageID);

    } catch (error) {
      return api.sendMessage(`❌ Erza Error:\n${error.message}`, event.threadID, event.messageID);
    }
  }
};
