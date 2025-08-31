const axios = require("axios");

module.exports = {
  config: {
    name: "bot",
    version: "1.0",
    author: "Jubayer",
    countDown: 2,
    role: 0,
    shortDescription: { en: "Smart bot system" },
    longDescription: { en: "Chat with bot, teach, edit, delete, list" },
    category: "talk"
  },

  onStart: async function({ message, args }) {
    const base = "http://176.100.37.241:6206/sim";

    const sendRes = async (url, errMsg) => {
      try {
        const res = await axios.get(url);
        return message.reply(res.data.msg || res.data.reply || "✅ Done");
      } catch {
        return message.reply(errMsg || "❌ Something went wrong.");
      }
    };
    if (!args[0]) return message.reply("❌ Usage: teach | edit | delete | askinfo | list");

    const input = args.slice(1).join(" ").split("-");
    switch (args[0]) {
      case "teach": {
        if (input.length < 2) return message.reply("❌ Usage: bot teach ask - ans");
        return sendRes(`${base}/teach?ask=${input[0].trim()}&ans=${input[1].trim()}`);
      }

      case "edit": {
        if (input.length < 2) return message.reply("❌ Usage: bot edit old - new");
        return sendRes(`${base}/edit?old=${input[0].trim()}&newtext=${input[1].trim()}`);
      }

      case "delete": {
        if (input.length < 2) return message.reply("❌ Usage: bot delete ask - ans");
        return sendRes(`${base}/delete?ask=${input[0].trim()}&ans=${input[1].trim()}`);
      }

      case "askinfo": {
        const ask = args.slice(1).join(" ");
        try {
          const res = await axios.get(`${base}/askinfo?ask=${ask}`);
          if (res.data.error) return message.reply(res.data.error);
          return message.reply("📚 Teach List:\n" + res.data.answers.map(a => "📌 " + a).join("\n"));
        } catch {
          return message.reply("❌ Error fetching askinfo.");
        }
      }

      case "list": {
        try {
          const res = await axios.get(`${base}/list`);
          return message.reply("📜 All Teaches:\n" + res.data.teaches.map(a => "📌 " + a).join("\n"));
        } catch {
          return message.reply("❌ Could not fetch list.");
        }
      }

      default: return message.reply("❌ Unknown action.");
    }
  },

  onChat: async function({ event, message, api }) {
    const base = "http://176.100.37.241:6206/sim";
    const text = event.body?.trim();
    if (!text) return;
    if (text.toLowerCase() === "bot") {
      const replies = [
        "✨ তোর সাথে কথা নাই কারণ তুই অনেক লুচ্চা 💔",
        "😑 দূরে যাইয়া মুরি খা...",
        "🍹 এই নাও জুস খাও...",
        "🤖 Hi, I am bot, can I help you?",
        "😍 হুম জান বলো 😎",
        "💬 Bolo ki korte pari tomar jonno",
        "🪄 তাবিজ কইরা হইলেও..."
      ];
      const pick = replies[Math.floor(Math.random() * replies.length)];
      return message.reply(
        `✢━━━━━━━━━━━━━━━✢\n\n👤 ${event.senderID}\n\n💬 ${pick}\n\n✢━━━━━━━━━━━━━━━✢`
      );
    }
    if (text.toLowerCase().startsWith("bot ")) {
      const q = text.slice(4).trim();
      try {
        const res = await axios.get(`${base}?ask=${encodeURIComponent(q)}`);
        return message.reply(res.data.reply || "🤔 No reply found.");
      } catch {
        return message.reply("❌ Error fetching reply.");
      }
    }
    if (event.type === "message_reply" && event.messageReply.senderID === api.getCurrentUserID()) {
      try {
        const res = await axios.get(`${base}?ask=${encodeURIComponent(text)}`);
        return message.reply(res.data.reply || "...");
      } catch {
        return message.reply("❌ Error in reply mode.");
      }
    }
  }
};
