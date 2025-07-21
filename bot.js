const axios = require("axios");

const baseApiUrl = "https://raw.githubusercontent.com/VincentXJubayer/JUBAYE4/main/apis.json";

module.exports.config = {
  name: "bot",
  version: "2.1",
  hasPermssion: 0,
  credits: "Jubayer",
  description: "Bot chat with teaching & reply system",
  commandCategory: "chat",
  usages: "[teach/delete/edit/info/keyinfo/help] or reply based chat",
  cooldowns: 1
};

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
  const { threadID, messageID, senderID } = event;
  const input = args.join(" ").trim();

  if (!input) return;

  const [cmd, ...rest] = args;
  const content = rest.join(" ").trim();

  if (cmd === "teach") {
    const [ask, ans] = content.split(" - ");
    if (!ask || !ans) return api.sendMessage("❌ Teach format: .bot teach প্রশ্ন - উত্তর", threadID, messageID);
    try {
      const res = await axios.get(`${baseApiUrl}?type=teach&ask=${encodeURIComponent(ask)}&ans=${encodeURIComponent(ans)}&uid=${senderID}`);
      return api.sendMessage(res.data.success ? `✅ শেখানো হয়েছে:\n"${ask}" → "${ans}"` : `❌ ${res.data.msg}`, threadID, messageID);
    } catch {
      return api.sendMessage("🚫 Teach API error.", threadID, messageID);
    }
  }

  if (cmd === "delete") {
    const [ask, ans] = content.split(" - ");
    if (!ask || !ans) return api.sendMessage("❌ Delete format: .bot delete প্রশ্ন - উত্তর", threadID, messageID);
    try {
      const res = await axios.get(`${baseApiUrl}?type=delete&ask=${encodeURIComponent(ask)}&ans=${encodeURIComponent(ans)}`);
      return api.sendMessage(res.data.success ? `🗑️ মুছে ফেলা হয়েছে:\n"${ans}" from "${ask}"` : `❌ ${res.data.msg}`, threadID, messageID);
    } catch {
      return api.sendMessage("🚫 Delete API error.", threadID, messageID);
    }
  }

  if (cmd === "edit") {
    const [oldAsk, newAsk] = content.split(" - ");
    if (!oldAsk || !newAsk) return api.sendMessage("❌ Edit format: .bot edit পুরাতনপ্রশ্ন - নতুনপ্রশ্ন", threadID, messageID);
    try {
      const res = await axios.get(`${baseApiUrl}?type=edit&old=${encodeURIComponent(oldAsk)}&new=${encodeURIComponent(newAsk)}`);
      return api.sendMessage(res.data.success ? `✏️ এডিট সম্পন্ন:\n"${oldAsk}" → "${newAsk}"` : `❌ ${res.data.msg}`, threadID, messageID);
    } catch {
      return api.sendMessage("🚫 Edit API error.", threadID, messageID);
    }
  }

  if (cmd === "info") {
    try {
      const res = await axios.get(`${baseApiUrl}?type=info`);
      const { totalKeys, totalResponses } = res.data.data;
      return api.sendMessage(`✨ মোট প্রশ্ন: ${totalKeys}\n💬 মোট উত্তর: ${totalResponses}`, threadID, messageID);
    } catch {
      return api.sendMessage("🚫 Info API error.", threadID, messageID);
    }
  }

  if (cmd === "keyinfo") {
    const ask = content;
    if (!ask) return api.sendMessage("❌ Keyinfo format: .bot keyinfo প্রশ্ন", threadID, messageID);
    try {
      const res = await axios.get(`${baseApiUrl}?type=keyinfo&ask=${encodeURIComponent(ask)}`);
      if (!res.data.success) return api.sendMessage(`❌ ${res.data.msg}`, threadID, messageID);
      const list = res.data.data.answers.map((a, i) => `${i + 1}. ${a}`).join("\n");
      return api.sendMessage(`📚 উত্তরসমূহ:\n${list}`, threadID, messageID);
    } catch {
      return api.sendMessage("🚫 Keyinfo API error.", threadID, messageID);
    }
  }

  if (cmd === "help") {
    const msg =
`╭•┄┅═══❁🌺❁═══┅┄•╮
  𝙱𝙾𝚃 𝙲𝙾𝙼𝙼𝙰𝙽𝙳 𝙷𝙴𝙻𝙿 ✨✨
╰•┄┅═══❁🌺❁═══┅┄•╯

•—» .bot teach প্রশ্ন - উত্তর
•—» .bot delete প্রশ্ন - উত্তর
•—» .bot edit পুরাতনপ্রশ্ন - নতুনপ্রশ্ন
•—» .bot keyinfo প্রশ্ন
•—» .bot info

💬 শুধু "Bot প্রশ্ন" লিখলেই উত্তর দিবে!
📌 "Bot" লিখলে দেবে স্পেশাল মেসেজ!
🔁 রিপ্লাই করেও প্রশ্ন করলে উত্তর দিবে!
`;
    return api.sendMessage(msg, threadID, messageID);
  }

  try {
    const res = await axios.get(`${baseApiUrl}?type=ask&ask=${encodeURIComponent(input)}`);
    const msg = res.data.success ? res.data.data.msg : "🤖 আমি এখনো এই প্রশ্নের উত্তর জানি না।";
    const info = await api.sendMessage(msg, threadID, messageID);
    global.client.handleReply.push({
      type: "reply",
      name: this.config.name,
      author: senderID,
      head: input,
      messageID: info.messageID
    });
  } catch {
    return api.sendMessage("🚫 Chat API error.", threadID, messageID);
  }
};

module.exports.handleReply = async function ({ api, event, handleReply }) {
  const { threadID, messageID, senderID, body } = event;
  try {
    const res = await axios.get(`${baseApiUrl}?type=ask&ask=${encodeURIComponent(body)}`);
    const msg = res.data.success ? res.data.data.msg : "🤖 আমি এখনো এই প্রশ্নের উত্তর জানি না।";
    const info = await api.sendMessage(msg, threadID, messageID);
    global.client.handleReply.push({
      type: "reply",
      name: this.config.name,
      author: senderID,
      head: body,
      messageID: info.messageID
    });
  } catch {
    return api.sendMessage("🚫 Reply API error.", threadID, messageID);
  }
};

module.exports.handleEvent = async function ({ event, api }) {
  const { body, threadID, messageID, type, messageReply, senderID } = event;
  if (!body || type !== "message") return;

  const lowered = body.toLowerCase();

  if (lowered === "bot" || lowered === "বট") {
    const random = responses[Math.floor(Math.random() * responses.length)];
    return api.sendMessage(`╭•┄┅═══❁🌺❁═══┅┄•╮\n${random}\n╰•┄┅═══❁🌺❁═══┅┄•╯`, threadID, messageID);
  }

  if (lowered.startsWith("bot ") || lowered.startsWith("বট ")) {
    const question = body.slice(4).trim();
    if (!question) return;
    try {
      const res = await axios.get(`${baseApiUrl}?type=ask&ask=${encodeURIComponent(question)}`);
      const msg = res.data.success ? res.data.data.msg : "🤖 আমি এখনো এই প্রশ্নের উত্তর জানি না।";
      const info = await api.sendMessage(msg, threadID, messageID);
      global.client.handleReply.push({
        type: "reply",
        name: this.config.name,
        author: senderID,
        head: question,
        messageID: info.messageID
      });
    } catch {
      return api.sendMessage("🚫 Chat API error.", threadID, messageID);
    }
  }

  if (messageReply && messageReply.senderID === api.getCurrentUserID()) {
    try {
      const res = await axios.get(`${baseApiUrl}?type=ask&ask=${encodeURIComponent(body)}`);
      const msg = res.data.success ? res.data.data.msg : "🤖 আমি এখনো এই প্রশ্নের উত্তর জানি না।";
      const info = await api.sendMessage(msg, threadID, messageID);
      global.client.handleReply.push({
        type: "reply",
        name: this.config.name,
        author: senderID,
        head: body,
        messageID: info.messageID
      });
    } catch {
      return api.sendMessage("🚫 Reply API error.", threadID, messageID);
    }
  }
};
