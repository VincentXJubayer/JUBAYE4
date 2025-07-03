const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");

// 💠 Base API URL
const baseApiUrl = "https://raw.githubusercontent.com/VincentXJubayer/JUBAYE4/main/baseApiUrl.json";

module.exports.config = {
  name: "rndm",
  version: "2.0",
  hasPermssion: 0,
  credits: "Jubayer",
  description: "Upload or get random video by category",
  commandCategory: "media",
  usages: "/rndm [name] | /rndm add [name]",
  cooldowns: 5
};

module.exports.run = async function ({ api, event, args }) {
  const { threadID, messageID, messageReply } = event;

  if (!args[0]) {
    return api.sendMessage(
      "🌸 Usage:\n• /rndm [category] → Get a random video\n• /rndm add [category] → Add a video by replying to one",
      threadID,
      messageID
    );
  }

  const sub = args[0].toLowerCase();

  if (sub === "add") {
    const video = messageReply?.attachments?.[0];
    const category = args[1];

    if (!video || video.type !== "video")
      return api.sendMessage("🎥 Please reply to a video file to add it.", threadID, messageID);

    if (!category)
      return api.sendMessage("📝 Please provide a category name.", threadID, messageID);

    try {
      const res = await axios.get(`${baseApiUrl}/api/add`, {
        params: {
          title: category,
          url: video.url
        }
      });

      const data = res.data;

      if (data.success) {
        return api.sendMessage(
          `📩 MESSAGE: Video Added Successfully\n📛 CATEGORY: ${data.name}\n🔗 LINK: ${data.driveUrl}`,
          threadID,
          messageID
        );
      } else {
        return api.sendMessage(`⚠️ Failed to add video:\n${data.message}`, threadID, messageID);
      }
    } catch (err) {
      console.error(err);
      return api.sendMessage("🚫 Error occurred while uploading the video.", threadID, messageID);
    }
  }

  const category = args[0];

  try {
    const res = await axios.get(`${baseApiUrl}/api/video/${encodeURIComponent(category)}`);
    const data = res.data;
    const videoUrl = data?.data?.video;

    if (!videoUrl) {
      return api.sendMessage("😢 No video found for this category.", threadID, messageID);
    }

    const tempPath = path.join(__dirname, "cache", `rndm_${Date.now()}.mp4`);
    const videoData = await axios.get(videoUrl, { responseType: "arraybuffer" });

    await fs.outputFile(tempPath, Buffer.from(videoData.data, "binary"));

    return api.sendMessage(
      {
        body: `🎬 RANDOM VIDEO\n\n📂 Category: ${data.data.by}\n🎞️ Total Videos: ${data.total || 0}`,
        attachment: fs.createReadStream(tempPath)
      },
      threadID,
      () => fs.unlinkSync(tempPath),
      messageID
    );
  } catch (err) {
    console.error(err);
    return api.sendMessage("🚫 Failed to fetch video. Maybe the category is empty or there's a network issue.", threadID, messageID);
  }
};
