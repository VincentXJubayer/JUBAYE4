const { exec } = require("child_process");

module.exports.config = {
  name: "npm",
  version: "1.0.0",
  credits: "Jubayer",
  description: "📦 Install or remove npm packages",
  usage: "<-a/-d> <package-name>",
  cooldowns: 5,
  hasPermission: 2,
  prefix: false,
};

module.exports.run = async function({ api, event, args }) {
  const { threadID, messageID } = event;
  const action = args[0];
  const packageName = args.slice(1).join(" ");

  if (!["-a", "-d"].includes(action) || !packageName) {
    return api.sendMessage(
      `╭•─────────────•╮\n` +
      `    𝙉𝙋𝙈 𝙋𝘼𝘾𝙆𝘼𝙂𝙀 𝙈𝘼𝙉𝘼𝙂𝙀𝙍 📦\n` +
      `╰•─────────────•╯\n\n` +
      `🔹 Add Package:\n   ➤ ${global.config.PREFIX}npm -a express\n` +
      `🔹 Delete Package:\n   ➤ ${global.config.PREFIX}npm -d axios\n\n` +
      `📌 Only for bot admins!`,
      threadID, messageID
    );
  }

  const command = action === "-a"
    ? `npm install ${packageName}`
    : `npm uninstall ${packageName}`;

  api.sendMessage(`⏳ Processing request for: ${packageName}...`, threadID, messageID);

  exec(command, (error, stdout, stderr) => {
    if (error) {
      return api.sendMessage(`❌ Error:\n${error.message}`, threadID);
    }
    if (stderr && !stdout) {
      return api.sendMessage(`⚠️ Warning:\n${stderr}`, threadID);
    }

    const resultText = action === "-a"
      ? `✅ Successfully installed: 𝙿𝙰𝙲𝙺𝙰𝙶𝙴 → ${packageName}`
      : `🗑️ Successfully removed: 𝙿𝙰𝙲𝙺𝙰𝙶𝙴 → ${packageName}`;

    return api.sendMessage(
      `╭•─────⦿🛠️⦿─────•╮\n` +
      `${resultText}\n` +
      `╰•────────────────•╯`,
      threadID
    );
  });
};
