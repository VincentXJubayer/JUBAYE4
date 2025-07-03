const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");

const baseApiUrl = "https://raw.githubusercontent.com/VincentXJubayer/JUBAYE4/main/baseApiUrl.json";

module.exports = {
  config: {
    name: "rndm",
    version: "2.0",
    author: "Jubayer",
    countDown: 5,
    role: 0,
    shortDescription: "Upload/get random video",
    longDescription: "Upload or fetch a random video by category name",
    category: "media",
    guide: {
      en: "{pn} [category] → Get random video\n{pn} add [category] → Add video (reply to video)"
    }
  },

  onStart: async function ({ message, event, args }) {
    if (!args[0]) {
      return message.reply(
        "🌸 Usage:\n• /rndm [category] → Get a random video\n• /rndm add [category] → Add a video by replying to one"
      );
    }

    const sub = args[0].toLowerCase();

    if (sub === "add") {
      const reply = event.messageReply;
      const video = reply?.attachments?.[0];
      const category = args[1];

      if (!video || video.type !== "video") {
        return message.reply("🎥 Please reply to a video file to add it.");
      }

      if (!category) {
        return message.reply("📝 Please provide a category name.\nExample: /rndm add funny");
      }

      try {
        const res = await axios.get(`${baseApiUrl}/api/add`, {
          params: {
            title: category,
            url: video.url
          }
        });

        const data = res.data;

        if (data.success) {
          return message.reply(
            `📩 MESSAGE: Video Added Successfully\n📛 CATEGORY: ${data.name}\n🔗 LINK: ${data.driveUrl}`
          );
        } else {
          return message.reply(`⚠️ Failed to add video:\n${data.message}`);
        }
      } catch (err) {
        console.error(err);
        return message.reply("🚫 An error occurred while uploading the video.");
      }
    }

    const category = args[0];

    try {
      const res = await axios.get(`${baseApiUrl}/api/video/${encodeURIComponent(category)}`);
      const data = res.data;
      const videoUrl = data?.data?.video;

      if (!videoUrl) {
        return message.reply("😢 No video found for this category.");
      }

      const tempPath = path.join(__dirname, "cache", `rndm_${Date.now()}.mp4`);
      const videoData = await axios.get(videoUrl, { responseType: "arraybuffer" });

      await fs.outputFile(tempPath, Buffer.from(videoData.data, "binary"));

      await message.reply(
        {
          body: `🎬 RANDOM VIDEO\n\n📂 Category: ${data.data.by}\n🎞️ Total Videos: ${data.total || 0}`,
          attachment: fs.createReadStream(tempPath)
        }
      );

      await fs.unlink(tempPath);
    } catch (err) {
      console.error(err);
      return message.reply("🚫 Failed to fetch video. Maybe the category is empty or there's a network issue.");
    }
  }
};
