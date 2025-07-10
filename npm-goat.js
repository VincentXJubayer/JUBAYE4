const { exec } = require("child_process");

module.exports = {
  config: {
    name: "npm",
    aliases: [],
    version: "1.0",
    author: "Jubayer",
    countDown: 5,
    role: 2, 
    shortDescription: {
      en: "Install or remove npm packages"
    },
    longDescription: {
      en: "Install (-a) or remove (-d) an npm package dynamically"
    },
    category: "owner",
    guide: {
      en: "{pn} -a <package> → install\n{pn} -d <package> → uninstall"
    }
  },

  onStart: async function ({ api, args, message }) {
    const action = args[0];
    const packageName = args.slice(1).join(" ");

    if (!["-a", "-d"].includes(action) || !packageName) {
      return message.reply(
        "╭•─────⦿📦⦿─────•╮\n" +
        "   𝙉𝙋𝙈 𝙋𝘼𝘾𝙆𝘼𝙂𝙀 𝙈𝘼𝙉𝘼𝙂𝙀𝙍\n" +
        "╰•────────────────•╯\n\n" +
        "🔹 Add Package:\n" +
        "   ➤ {pn} -a express\n" +
        "🔹 Delete Package:\n" +
        "   ➤ {pn} -d axios\n\n" +
        "📌 Only available for admins."
      );
    }

    const command = action === "-a"
      ? `npm install ${packageName}`
      : `npm uninstall ${packageName}`;

    message.reply(`⏳ Processing: ${packageName}...`);

    exec(command, (error, stdout, stderr) => {
      if (error) {
        return message.reply(`❌ Error:\n${error.message}`);
      }
      if (stderr && !stdout) {
        return message.reply(`⚠️ Warning:\n${stderr}`);
      }

      const successMsg = action === "-a"
        ? `✅ Installed: 𝙿𝙰𝙲𝙺𝙰𝙂𝙴 → ${packageName}`
        : `🗑️ Removed: 𝙿𝙰𝙲𝙺𝙰𝙶𝙴 → ${packageName}`;

      return message.reply(
        `╭•─────⦿🛠️⦿─────•╮\n` +
        `${successMsg}\n` +
        `╰•────────────────•╯`
      );
    });
  }
};
