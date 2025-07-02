const axios = require("axios");

const jubayerApiUrl = "https://raw.githubusercontent.com/VincentXJubayer/JUB4YE4/main/baseApiUrl.json";

module.exports = {
  config: {
    name: "age",
    aliases: ["agecheck", "getage", "birthdayage"],
    version: "1.0",
    author: "Jubayer",
    cooldown: 5,
    description: "🎂 Calculate your age from birthdate (DD-MM-YYYY)",
    usage: "age [DD-MM-YYYY]"
  },

  onStart: async function({ api, event, args }) {
    try {
      if (!args[0]) {
        return api.sendMessage(
          "⚠️ Please provide your birthdate in `DD-MM-YYYY` format.",
          event.threadID,
          event.messageID
        );
      }

      const date = args[0];
      const validFormat = /^\d{2}-\d{2}-\d{4}$/;
      if (!validFormat.test(date)) {
        return api.sendMessage(
          "❌ Wrong format!\n✅ Use `DD-MM-YYYY`\nExample: `age 01-01-2000`",
          event.threadID,
          event.messageID
        );
      }

      const { data: baseData } = await axios.get(jubayerApiUrl);
      const apiUrl = `${baseData.jubayer}/age?birth_date=${encodeURIComponent(date)}`;

      const res = await axios.get(apiUrl);
      const data = res.data;

      if (!data.birthDate) {
        return api.sendMessage(
          "🚫 Could not find any data.\n🔁 Please double-check your date.",
          event.threadID,
          event.messageID
        );
      }

      let message = `🎉 𝗔𝗴𝗲 𝗖𝗮𝗹𝗰𝘂𝗹𝗮𝘁𝗶𝗼𝗻 𝗥𝗲𝘀𝘂𝗹𝘁 🎉\n\n`;
      message += `📅 𝗕𝗶𝗿𝘁𝗵 𝗗𝗮𝘁𝗲: ${data.birthDate}\n\n`;
      message += `🗓️ 𝗖𝘂𝗿𝗿𝗲𝗻𝘁 𝗔𝗴𝗲:\n`;
      message += `👉 ${data.ageYears} 𝘆𝗲𝗮𝗿𝘀\n`;
      message += `👉 ${data.ageDays} 𝗱𝗮𝘆𝘀\n`;
      message += `👉 ${data.ageHours} 𝗵𝗼𝘂𝗿𝘀\n`;
      message += `👉 ${data.ageMinutes} 𝗺𝗶𝗻𝘂𝘁𝗲𝘀\n`;
      message += `👉 ${data.ageSeconds} 𝘀𝗲𝗰𝗼𝗻𝗱𝘀\n\n`;
      message += `🎈 𝗡𝗲𝘅𝘁 𝗕𝗶𝗿𝘁𝗵𝗱𝗮𝘆: ${data.nextBirthday}\n`;
      message += `⏳ 𝗧𝗶𝗺𝗲 𝗟𝗲𝗳𝘁:\n`;
      message += `   📆 ${data.timeToNextBirthday.days} 𝗱𝗮𝘆𝘀\n`;
      message += `   ⏱️ ${data.timeToNextBirthday.hours} 𝗵𝗼𝘂𝗿𝘀\n`;
      message += `   ⌛ ${data.timeToNextBirthday.minutes} 𝗺𝗶𝗻𝘂𝘁𝗲𝘀\n`;
      message += `   ⌚ ${data.timeToNextBirthday.seconds} 𝘀𝗲𝗰𝗼𝗻𝗱𝘀`;

      return api.sendMessage(message, event.threadID, event.messageID);
    } catch (e) {
      return api.sendMessage(
        "🚨 Something went wrong. Please try again later.",
        event.threadID,
        event.messageID
      );
    }
  }
};
