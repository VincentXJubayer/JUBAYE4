const axios = require("axios");

module.exports.config = {
  name: "driveupload",
  version: "1.0.0",
  hasPermission: 0,
  credits: "Jubayer",
  description: "Upload replied media to Google Drive",
  commandCategory: "tools",
  usages: "[reply to media]",
  cooldowns: 5
};

module.exports.run = async function({ api, event }) {
  const reply = event.messageReply;
  const jubayerBase = "https://raw.githubusercontent.com/VincentXJubayer/JUBAYE4/main/baseApiUrl.json";

  if (!reply || !reply.attachments || reply.attachments.length === 0)
    return api.sendMessage("⚠️ Please reply to a media file to upload.", event.threadID, event.messageID);

  const fileUrl = reply.attachments[0].url;
  if (!fileUrl)
    return api.sendMessage("❌ Unable to retrieve the file URL.", event.threadID, event.messageID);

  api.sendMessage("⏳ Uploading to Drive... Please wait.", event.threadID, event.messageID);

  try {
    const endpoint = `${jubayerBase}/upload?url=${encodeURIComponent(fileUrl)}`;
    const res = await axios.get(endpoint);
    const result = res.data;

    if (result.driveUrl) {
      api.sendMessage(`✅ Upload complete!\n\n📁 Drive Link:\n${result.driveUrl}`, event.threadID, event.messageID);
    } else if (result.message) {
      api.sendMessage(`ℹ️ ${result.message}`, event.threadID, event.messageID);
    } else {
      api.sendMessage("⚠️ Upload finished, but no link was returned.", event.threadID, event.messageID);
    }
  } catch (e) {
    api.sendMessage("❌ Upload failed. Please try again later.", event.threadID, event.messageID);
  }
};
