const axios = require("axios");

const baseApiUrl = "https://islamic-cyber-chat-simsimi-apis-05.onrender.com/sim";

module.exports.config = {
  name: "bot",
  version: "2.2",
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
      return api.sendMessage(res.data.success ? `📝Your Data Added To Database Successfull\n1️⃣ASK: ${ask}\n2️⃣ANS: ${ans}` : `❌ ${res.data.msg}`, threadID, messageID);
    } catch {
      return api.sendMessage("🚫 Teach API error.", threadID, messageID);
    }
  }

  if (cmd === "delete") {
    const [ask, ans] = content.split(" - ");
    if (!ask || !ans) return api.sendMessage("❌ Delete format: .bot delete ask - answer ", threadID, messageID);
    try {
      const res = await axios.get(`${baseApiUrl}?type=delete&ask=${encodeURIComponent(ask)}&ans=${encodeURIComponent(ans)}`);
      return api.sendMessage(res.data.success ? ` ✅ 𝙰𝚜𝚔 𝙳𝚎𝚕𝚎𝚝𝚎 𝚜𝚞𝚌𝚌𝚎𝚜𝚜𝚏𝚞𝚕𝚕𝚢:\n"${ans}" from "${ask}"` : `❌ ${res.data.msg}`, threadID, messageID);
    } catch {
      return api.sendMessage("error 🦆", threadID, messageID);
    }
  }

  if (cmd === "edit") {
    const [oldAsk, newAsk] = content.split(" - ");
    if (!oldAsk || !newAsk) return api.sendMessage("❌ Edit format: .bot edit Newask - old_ask", threadID, messageID);
    try {
      const res = await axios.get(`${baseApiUrl}?type=edit&old=${encodeURIComponent(oldAsk)}&new=${encodeURIComponent(newAsk)}`);
      return api.sendMessage(res.data.success ? `✏️ 𝙴𝚍𝚒𝚝 𝙳𝚘𝚗𝚎:\n"${oldAsk}" → "${newAsk}"` : `❌ ${res.data.msg}`, threadID, messageID);
    } catch {
      return api.sendMessage("error 🦆", threadID, messageID);
    }
  }

  if (cmd === "info") {
    try {
      const res = await axios.get(`${baseApiUrl}?type=info`);
      const { totalKeys, totalResponses } = res.data.data;
      return api.sendMessage(`✨ 𝚃𝚘𝚝𝚎𝚕 𝙰𝚜𝚔: ${totalKeys}\n💬 𝚃𝚘𝚝𝚎𝚕 𝙰𝚗𝚜𝚠𝚎𝚛: ${totalResponses}`, threadID, messageID);
    } catch {
      return api.sendMessage("error 🦆", threadID, messageID);
    }
  }

  if (cmd === "keyinfo") {
    const ask = content;
    if (!ask) return api.sendMessage("❌ 𝙺𝚎𝚢𝚒𝚗𝚏𝚘 𝚏𝚘𝚛𝚖𝚊𝚝: /𝚋𝚘𝚝 𝚔𝚎𝚢𝚒𝚗𝚏𝚘 𝚊𝚜𝚔", threadID, messageID);
    try {
      const res = await axios.get(`${baseApiUrl}?type=keyinfo&ask=${encodeURIComponent(ask)}`);
      if (!res.data.success) return api.sendMessage(`❌ ${res.data.msg}`, threadID, messageID);
      const list = res.data.data.answers.map((a, i) => `${i + 1}. ${a}`).join("\n");
      return api.sendMessage(`📚 𝙰𝚗𝚜𝚠𝚎𝚛𝚜:\n${list}`, threadID, messageID);
    } catch {
      return api.sendMessage(" 💫😿 𝙺𝚎𝚢𝚒𝚗𝚏𝚘 𝙰𝙿𝙸 𝚎𝚛𝚛𝚘𝚛.", threadID, messageID);
    }
  }

  if (cmd === "help") {
    const msg =
`╭•┄┅═══❁🌺❁═══┅┄•╮
  𝙱𝙾𝚃 𝙲𝙾𝙼𝙼𝙰𝙽𝙳 𝙷𝙴𝙻𝙿 ✨✨
╰•┄┅═══❁🌺❁═══┅┄•╯

•—» .𝚋𝚘𝚝 𝚝𝚎𝚊𝚌𝚑 𝚊𝚜𝚔 - 𝚊𝚗𝚜𝚠𝚎𝚛
•—» .𝚋𝚘𝚝 𝚍𝚎𝚕𝚎𝚝𝚎 𝚊𝚜𝚔 - 𝚊𝚗𝚜𝚠𝚎𝚛
•—» .𝚋𝚘𝚝 𝚎𝚍𝚒𝚝 𝚘𝚕𝚍𝙰𝚜𝚔 - 𝙽𝚎𝚠𝙰𝚜𝚔
•—» .𝚋𝚘𝚝 𝚔𝚎𝚢𝚒𝚗𝚏𝚘 𝙰𝚜𝚔 
•—» .𝚋𝚘𝚝 𝚒𝚗𝚏𝚘

💬 𝙹𝚞𝚜𝚝 𝚝𝚢𝚙𝚎 "𝙱𝚘𝚝 𝚀𝚞𝚎𝚜𝚝𝚒𝚘𝚗" 𝚊𝚗𝚍 𝚒𝚝 𝚠𝚒𝚕𝚕 𝚊𝚗𝚜𝚠𝚎𝚛! 
📌 𝚃𝚢𝚙𝚎 "𝙱𝚘𝚝" 𝚊𝚗𝚍 𝚒𝚝 𝚠𝚒𝚕𝚕 𝚐𝚒𝚟𝚎 𝚢𝚘𝚞 𝚊 𝚜𝚙𝚎𝚌𝚒𝚊𝚕 𝚖𝚎𝚜𝚜𝚊𝚐𝚎! 
🔁 𝙸𝚏 𝚢𝚘𝚞 𝚛𝚎𝚙𝚕𝚢 𝚊𝚗𝚍 𝚊𝚜𝚔 𝚊 𝚚𝚞𝚎𝚜𝚝𝚒𝚘𝚗, 𝚒𝚝 𝚠𝚒𝚕𝚕 𝚊𝚗𝚜𝚠𝚎𝚛!`;
    return api.sendMessage(msg, threadID, messageID);
  }

  try {
    const res = await axios.get(`${baseApiUrl}?type=ask&ask=${encodeURIComponent(input)}`);
    const msg = res.data.success ? res.data.data.msg : "🤖 𝙸 𝚜𝚝𝚒𝚕𝚕 𝚍𝚘𝚗'𝚝 𝚔𝚗𝚘𝚠 𝚝𝚑𝚎 𝚊𝚗𝚜𝚠𝚎𝚛 𝚝𝚘 𝚝𝚑𝚒𝚜 𝚚𝚞𝚎𝚜𝚝𝚒𝚘𝚗.";
    const info = await api.sendMessage(msg, threadID, messageID);
    global.client.handleReply.push({
      type: "reply",
      name: this.config.name,
      author: senderID,
      head: input,
      messageID: info.messageID
    });
  } catch {
    return api.sendMessage("error 🦆.", threadID, messageID);
  }
};

module.exports.handleReply = async function ({ api, event, handleReply }) {
  const { threadID, messageID, senderID, body } = event;
  try {
    cinfo
      parentQuestion = handleReply.head || "";
    const res = await axios.get(`${baseApiUrl}?type=ask&ask=${encodeURIComponent(body)}&context=${encodeURIComponent(parentQuestion)}`);
    const msg = res.data.success ? res.data.data.msg : "🤖 𝙸 𝚜𝚝𝚒𝚕𝚕 𝚍𝚘𝚗'𝚝 𝚔𝚗𝚘𝚠 𝚝𝚑𝚎 𝚊𝚗𝚜𝚠𝚎𝚛 𝚝𝚘 𝚝𝚑𝚒𝚜 𝚚𝚞𝚎𝚜𝚝𝚒𝚘𝚗.";
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
    return api.sendMessage(`╭•┄┅═══❁🌺❁═══┅┄•╮\n\n➤  ${name}\n💌 : ${random}\n\n╰•┄┅═══❁🌺❁═══┅┄•╯`, threadID, messageID);
  }

  if (lowered.startsWith("bot ") || lowered.startsWith("বট ")) {
    const question = body.slice(4).trim();
    if (!question) return;
    try {
      const res = await axios.get(`${baseApiUrl}?type=ask&ask=${encodeURIComponent(question)}`);
      const msg = res.data.success ? res.data.data.msg : "🤖 𝙸 𝚜𝚝𝚒𝚕𝚕 𝚍𝚘𝚗'𝚝 𝚔𝚗𝚘𝚠 𝚝𝚑𝚎 𝚊𝚗𝚜𝚠𝚎𝚛 𝚝𝚘 𝚝𝚑𝚒𝚜 𝚚𝚞𝚎𝚜𝚝𝚒𝚘𝚗.";
      const info = await api.sendMessage(msg, threadID, messageID);
      global.client.handleReply.push({
        type: "reply",
        name: this.config.name,
        author: senderID,
        head: question,
        messageID: info.messageID
      });
    } catch {
      return api.sendMessage("error 🦆.", threadID, messageID);
    }
  }

  if (messageReply && messageReply.senderID === api.getCurrentUserID()) {
    try {
      const repliedMsg = messageReply.body || "";
      const res = await axios.get(`${baseApiUrl}?type=ask&ask=${encodeURIComponent(body)}&context=${encodeURIComponent(repliedMsg)}`);
      const msg = res.data.success ? res.data.data.msg : "🤖 𝙸 𝚜𝚝𝚒𝚕𝚕 𝚍𝚘𝚗'𝚝 𝚔𝚗𝚘𝚠 𝚝𝚑𝚎 𝚊𝚗𝚜𝚠𝚎𝚛 𝚝𝚘 𝚝𝚑𝚒𝚜 𝚚𝚞𝚎𝚜𝚝𝚒𝚘𝚗.";
      const info = await api.sendMessage(msg, threadID, messageID);
      global.client.handleReply.push({
        type: "reply",
        name: this.config.name,
        author: senderID,
        head: body,
        messageID: info.messageID
      });
    } catch {
      return api.sendMessage("error 🦆.", threadID, messageID);
    }
  }
};
