const axios = require("axios");

const baseApiUrl = async () => {
  const re = await axios.get("https://raw.githubusercontent.com/VincentXJubayer/JUBAYE4/main/baseApiUrl.json");
  return re.data.jubayer;
};

module.exports = {
  config: {
    name: "flaggame",
    aliases: ["flag"],
    version: "1.0",
    author: "Jubayer",
    countDown: 10,
    role: 0,
    category: "game",
    guide: {
      en: "{pn} - Guess the country from the flag"
    }
  },

  onReply: async function ({ api, event, Reply, usersData }) {
    const { flag, author } = Reply;
    const rewardCoin = 500;
    const rewardExp = 121;

    if (event.senderID !== author) {
      return api.sendMessage("❌ This isn't your game!", event.threadID, event.messageID);
    }

    const userAnswer = event.body.toLowerCase();
    await api.unsendMessage(Reply.messageID);

    if (userAnswer === flag.toLowerCase()) {
      const userData = await usersData.get(event.senderID);
      userData.money += rewardCoin;
      userData.exp += rewardExp;
      await usersData.set(event.senderID, userData);

      return api.sendMessage(
        `✅ Correct!\nYou earned ${rewardCoin} coins & ${rewardExp} exp.`,
        event.threadID, event.messageID
      );
    } else {
      return api.sendMessage(
        `❌ Wrong!\nCorrect answer was: ${flag}`,
        event.threadID, event.messageID
      );
    }
  },

  onStart: async function ({ api, event }) {
    try {
      const apiUrl = await baseApiUrl();
      const response = await axios.get(`${apiUrl}/api/flag`);
      const { link, country } = response.data;

      const imgStream = await axios({
        method: "GET",
        url: link,
        responseType: "stream"
      });

      api.sendMessage({
        body: "🌍 Guess the country of this flag (Reply within 40 seconds):",
        attachment: imgStream.data
      }, event.threadID, (err, info) => {
        global.GoatBot.onReply.set(info.messageID, {
          commandName: this.config.name,
          messageID: info.messageID,
          author: event.senderID,
          flag: country
        });

        setTimeout(() => {
          api.unsendMessage(info.messageID);
        }, 40000);
      }, event.messageID);
    } catch (err) {
      console.error(err);
      api.sendMessage("❌ Failed to load flag. Try again later.", event.threadID, event.messageID);
    }
  }
};
