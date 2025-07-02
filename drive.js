const axios = require("axios");

const jubayer = "https://raw.githubusercontent.com/VincentXJubayer/JUBAYE4/main/baseApiUrl.json";

module.exports = {
  config: {
    name: "driveupload",
    aliases: ["d"],
    version: "1.0",
    author: "Jubayer",
    countDown: 5,
    role: 0,
    shortDescription: "Upload media to Drive",
    longDescription: "Send a replied media file to Drive using API",
    category: "tools",
    guide: {
      en: "{pn} (use by replying to a media file)",
    },
  },

  onStart: async ({ event, message }) => {
    const replyData = event.messageReply;

    if (!replyData || !replyData.attachments || replyData.attachments.length === 0) {
      return message.reply("Please reply to a media file to upload.");
    }

    const file = replyData.attachments[0];
    const fileLink = file.url;

    if (!fileLink) {
      return message.reply("Unable to fetch the file URL.");
    }

    const apiEndpoint = `${jubayer}/upload?url=${encodeURIComponent(fileLink)}`;

    message.reply("Uploading... Please wait.");

    try {
      const response = await axios.get(apiEndpoint);
      const result = response.data;

      if (result.driveUrl) {
        message.reply(`✅ Upload complete!\n\n📁 Drive Link:\n${result.driveUrl}`);
      } else if (result.message) {
        message.reply(result.message);
      } else {
        message.reply("Upload finished, but no link was returned.");
      }

    } catch (error) {
      message.reply("❌ Something went wrong during upload. Please try again later.");
    }
  },
};
