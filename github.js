const axios = require("axios");

const jubayer = "https://raw.githubusercontent.com/HXXJUBAYER/JUBAYE4/main/baseApiUrl.json";

module.exports = {
  config: {
    name: "github",
    version: "1.0",
    author: "Jubayer",
    countDown: 5,
    role: 0,
    shortDescription: "GitHub user info",
    longDescription: "Fetch GitHub profile details by username.",
    category: "tools",
    guide: {
      en: "{pn} <username>"
    }
  },

  onStart: async function ({ message, args }) {
    const username = args[0];
    if (!username) {
      return message.reply("🧩 Usage: .github <username>");
    }

    try {
      const res = await axios.get(`${jubayer}/github?id=${encodeURIComponent(username)}`);
      const u = res.data.data;

      const text = `👤 𝗡𝗮𝗺𝗲: ${u.name || "Not set"}  

🆔 𝗨𝘀𝗲𝗿𝗻𝗮𝗺𝗲: ${u.login}  

🧠 𝗕𝗶𝗼: ${u.bio || "No bio"}  

📍 𝗟𝗼𝗰𝗮𝘁𝗶𝗼𝗻: ${u.location || "Unknown"}  

🔗 𝗣𝗿𝗼𝗳𝗶𝗹𝗲: ${u.html_url}  

📦 𝗥𝗲𝗽𝗼𝘀: ${u.public_repos}  

👥 𝗙𝗼𝗹𝗹𝗼𝘄𝗲𝗿𝘀: ${u.followers}  

👣 𝗙𝗼𝗹𝗹𝗼𝘄𝗶𝗻𝗴: ${u.following}  

📅 𝗝𝗼𝗶𝗻𝗲𝗱: ${new Date(u.created_at).toISOString().split("T")[0]}`;

      const avatar = await axios.get(u.avatar_url, { responseType: "arraybuffer" });
      const buffer = Buffer.from(avatar.data, "binary");

      return message.reply({ body: text, attachment: buffer });

    } catch (err) {
      return message.reply("❌ User not found or API error.");
    }
  }
};
