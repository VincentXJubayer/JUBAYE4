const axios = require("axios");
const path = require("path");
const fs = require("fs");

const jubayer = "https://raw.githubusercontent.com/HXXJUBAYER/JUBAYE4/main/baseApiUrl.json";

module.exports = {
  config: {
    name: "unsplash",
    aliases: ["uph"],
    version: "1.0",
    author: "Jubayer",
    category: "media",
    description: "Search Unsplash and send images",
    guide: "Use: {pn} keyword - number\nExample: {pn} cat - 5"
  },

  onStart: async function({ api, event, args }) {
    try {
      const inputText = args.join(" ");
      if (!inputText.includes("-")) {
        const usage = `❌ Usage: ${this.config.name} keyword - number\nExample: ${this.config.name} cat - 5`;
        return api.sendMessage(usage, event.threadID, event.messageID);
      }

      const [keyword, countStr] = inputText.split("-").map(s => s.trim());
      const count = Math.min(20, parseInt(countStr) || 6);

      const jubayerUrl = `${jubayer}/api/unsplash?query=${encodeURIComponent(keyword)}&number=${count}`;

      const response = await axios.get(jubayerUrl, {
        headers: { author: this.config.author }
      });

      if (!response.data.images || response.data.images.length === 0) {
        return api.sendMessage("❌ No images found for your search.", event.threadID, event.messageID);
      }

      const cacheFolder = path.join(__dirname, "cache");
      if (!fs.existsSync(cacheFolder)) fs.mkdirSync(cacheFolder);

      const attachments = await Promise.all(
        response.data.images.map(async (imageUrl, index) => {
          const imageResponse = await axios.get(imageUrl, { responseType: "arraybuffer" });
          const filePath = path.join(cacheFolder, `image_${index + 1}.jpg`);
          await fs.promises.writeFile(filePath, imageResponse.data);
          return fs.createReadStream(filePath);
        })
      );

      const message = `✅ Found ${attachments.length} images for "${keyword}":`;
      await api.sendMessage({ body: message, attachment: attachments }, event.threadID, event.messageID);

      fs.rmSync(cacheFolder, { recursive: true, force: true });

    } catch (error) {
      api.sendMessage(`❌ Error occurred: ${error.message}`, event.threadID, event.messageID);
    }
  }
};
