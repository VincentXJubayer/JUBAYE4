const axios = require('axios');

const jubayer = "https://raw.githubusercontent.com/HXXJUBAYER/JUBAYE4/main/baseApiUrl.json";

module.exports.config = {
  name: "webss",
  aliases: ["screenshot"],
  version: "1.0",
  author: "JUBAYER AHMED",
  cooldown: 5,
  description: "Get website screenshot using jubayer screenshot API",
  usage: "[url]",
};

module.exports.run = async ({ event, api, args }) => {
  if (args.length === 0) {
    return api.sendMessage("❌ You must provide a URL.", event.threadID, event.messageID);
  }

  const url = args[0];

  try {
    const response = await axios.get(`${jubayer}/ss`, {
      params: { url },
      responseType: "arraybuffer"
    });

    if (response.headers['content-type'] && response.headers['content-type'].includes('image')) {
      const imageBuffer = Buffer.from(response.data, "binary");

      return api.sendMessage({
        body: `Screenshot of: ${url}\nAuthor: JUBAYER AHMED`,
        attachment: imageBuffer
      }, event.threadID, event.messageID);
    } else {
      return api.sendMessage("❌ Invalid screenshot response.", event.threadID, event.messageID);
    }
  } catch (error) {
    return api.sendMessage("❌ There was a problem taking the screenshot. Please try again.", event.threadID, event.messageID);
  }
};
