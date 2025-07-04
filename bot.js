const axios = require("axios");

module.exports.config = {
  name: "bot",
  version: "2.0",
  hasPermssion: 0,
  credits: "Jubayer",
  description: "Bot chat, teach & manage QA",
  commandCategory: "chat",
  usages: "[teach/delete/edit/info/keyinfo] or ask a question",
  cooldowns: 1,
};

const api = "";

const responses = [
  "আমাকে মেনশন দিয়ে লাভ নেই-!!😐🥲",
  "তুমি আমায় ডেকে কি পাবে....??\nআল্লাহ কে ডাকো জান্নাত পাবে-!!✨🌺",
  "বট বট ডেকো না খুব মায়া লাগে তুমার জন্যে-!!✨💜",
  "আর কষ্ট করে ডাকতে হবে না আমায়-!!🥺🤗\nআমি চলে আসেছি তুমার সাথে কথা বলার জন্য-!!👀🌚",
  "আজ থেকে খারাপ কাজ গুলো ছেরে দাও....!!😊\nতাহলে আমি তুমার কথা শুনব....!!😍😘",
  "আমাকে এতো বার ডেকো না...!🙂\nআল্লাহ তুমায় খুব ভালোবাসে...🖤😌\nতুমি তাকে ডাকো-!!✨🧡",
  "আমার জন্য কেদে লাভ নেই আল্লাহর জন্য নামাজে কাঁদ-!!❤️🤲",
  "মানুষ কে সম্মান করো তাহলে তুমি সকলের ভালোবাসা পাবে ইনশাল্লাহ-!!☺️🥰",
  "তুমি দিনে একবার ও নামাজ পরো নাহ আবার আমাকে ডাকো-!!😈",
  "আমি বে'নামাজি দের সথে কথা বলি নাহ-!!😾😈"
];

module.exports.run = async function ({ api, event, args }) {
  const input = args.join(" ").trim();
  const senderName = event.senderID;
  const threadID = event.threadID;
  const messageID = event.messageID;

  if (!input) {
    const random = responses[Math.floor(Math.random() * responses.length)];
    return api.sendMessage(`╭•┄┅═══❁🌺❁═══┅┄•╮\n${random}\n╰•┄┅═══❁🌺❁═══┅┄•╯`, threadID, messageID);
  }

  const [cmd, ...rest] = args;
  const content = rest.join(" ").trim();

  if (cmd === "teach") {
    const [ask, ans] = content.split(" - ");
    if (!ask || !ans) return api.sendMessage("❌ Teach format: bot teach প্রশ্ন - উত্তর", threadID, messageID);
    try {
      const res = await axios.get(`${api}?type=teach&ask=${encodeURIComponent(ask)}&ans=${encodeURIComponent(ans)}&uid=${senderName}`);
      return api.sendMessage(res.data.success ? `✅ শেখা সম্পন্ন: "${ask}" → "${ans}"` : `❌ ${res.data.msg}`, threadID, messageID);
    } catch (e) {
      return api.sendMessage("🚫 Teach API error.", threadID, messageID);
    }
  }

  if (cmd === "delete") {
    const [ask, ans] = content.split(" - ");
    if (!ask || !ans) return api.sendMessage("❌ Delete format: bot delete প্রশ্ন - উত্তর", threadID, messageID);
    try {
      const res = await axios.get(`${api}?type=delete&ask=${encodeURIComponent(ask)}&ans=${encodeURIComponent(ans)}`);
      return api.sendMessage(res.data.success ? `🗑️ মুছে ফেলা হলো: "${ans}" from "${ask}"` : `❌ ${res.data.msg}`, threadID, messageID);
    } catch {
      return api.sendMessage("🚫 Delete API error.", threadID, messageID);
    }
  }

  if (cmd === "edit") {
    const [oldAsk, newAsk] = content.split(" - ");
    if (!oldAsk || !newAsk) return api.sendMessage("❌ Edit format: bot edit পুরাতনপ্রশ্ন - নতুনপ্রশ্ন", threadID, messageID);
    try {
      const res = await axios.get(`${api}?type=edit&old=${encodeURIComponent(oldAsk)}&new=${encodeURIComponent(newAsk)}`);
      return api.sendMessage(res.data.success ? `✏️ এডিট সম্পন্ন: "${oldAsk}" → "${newAsk}"` : `❌ ${res.data.msg}`, threadID, messageID);
    } catch {
      return api.sendMessage("🚫 Edit API error.", threadID, messageID);
    }
  }

  if (cmd === "info") {
    try {
      const res = await axios.get(`${api}?type=info`);
      const { totalKeys, totalResponses } = res.data.data;
      return api.sendMessage(`📊 মোট প্রশ্ন: ${totalKeys}\n💬 মোট উত্তর: ${totalResponses}`, threadID, messageID);
    } catch {
      return api.sendMessage("🚫 Info API error.", threadID, messageID);
    }
  }

  if (cmd === "keyinfo") {
    const ask = content;
    if (!ask) return api.sendMessage("❌ Keyinfo format: bot keyinfo প্রশ্ন", threadID, messageID);
    try {
      const res = await axios.get(`${api}?type=keyinfo&ask=${encodeURIComponent(ask)}`);
      if (!res.data.success) return api.sendMessage(`❌ ${res.data.msg}`, threadID, messageID);
      const list = res.data.data.answers.map((a, i) => `${i + 1}. ${a}`).join("\n");
      return api.sendMessage(`📚 উত্তরসমূহ:\n${list}`, threadID, messageID);
    } catch {
      return api.sendMessage("🚫 Keyinfo API error.", threadID, messageID);
    }
  }

  try {
    const res = await axios.get(`${api}?type=ask&ask=${encodeURIComponent(input)}`);
    return api.sendMessage(res.data.success ? res.data.data.msg : "🤖 আমি এখনো এই প্রশ্নের উত্তর জানি না।", threadID, messageID);
  } catch {
    return api.sendMessage("🚫 Chat API error.", threadID, messageID);
  }
};
