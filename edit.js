const axios = require("axios");
const fetch = require("node-fetch");
const { writeFileSync, unlinkSync, createReadStream } = require("fs");
const path = require("path");

module.exports = {
  config: {
    name: "imgedit",
    version: "1.0",
    author: "Jubayer",
    countDown: 5,
    role: 0,
    category: "ai",
    guide: "{pn} <text>"
  },

  onStart: async function ({ api, event, args }) {
    if (!(event.type === "message_reply" && event.messageReply.attachments.length > 0)) {
      return api.sendMessage("Reply to an image and use !edit <your text>", event.threadID, event.messageID);
    }

    if (!args.length) {
      return api.sendMessage("Please provide the text you want to apply.", event.threadID, event.messageID);
    }

    const text = args.join(" ");
    const imageUrl = event.messageReply.attachments[0].url;

    try {
      const imageResponse = await axios.get(imageUrl, { responseType: "arraybuffer" });
      const base64Image = Buffer.from(imageResponse.data, "binary").toString("base64");

      const response = await axios.post("https://jubayer-img-edit-apis.onrender.com/api/editimg", {
        prompt: text,
        image: base64Image
      });

      if (!response.data) {
        return api.sendMessage("Failed to edit the image.", event.threadID, event.messageID);
      }

      const replyText = response.data.message || "No response received from API.";
      api.sendMessage(`API Response:\n${replyText}`, event.threadID, event.messageID);

    } catch (error) {
      console.error(error);
      api.sendMessage("An error occurred. Please try again.", event.threadID, event.messageID);
    }
  }
};
