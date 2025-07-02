const axios = require("axios")
const fs = require("fs")
const path = require("path")

const baseApiUrl = async () => {
  const res = await axios.get("https://raw.githubusercontent.com/VincentXJubayer/JUB4YE4/main/baseApiUrl.json")
  return res.data.jubayer
}

module.exports = {
  config: {
    name: "poli",
    version: "1.0",
    author: "Jubayer",
    cooldowns: 5,
    role: 0,
    shortDescription: { en: "Generate image from prompt" },
    longDescription: { en: "Uses Pollinations API to generate image from text prompt" },
    category: "image",
    guide: { en: "{p}poli <prompt>" }
  },

  onStart: async function ({ message, args }) {
    if (!args.length) {
      message.reply("🔍 Prompt koi? Deya lagbe.")
      return
    }

    const prompt = args.join(" ").trim()
    const saveTo = path.join(__dirname, "cache")
    if (!fs.existsSync(saveTo)) fs.mkdirSync(saveTo)

    const fileName = `img_${Date.now()}.png`
    const fullPath = path.join(saveTo, fileName)

    try {
      const base = await baseApiUrl()
      const apiUrl = `${base}/api/poli/generate`

      const res = await axios.post(apiUrl, { prompt }, {
        responseType: "arraybuffer"
      })

      fs.writeFileSync(fullPath, res.data)

      message.reply({
        body: `🎨 Image from: "${prompt}"`,
        attachment: fs.createReadStream(fullPath)
      })

    } catch (e) {
      message.reply("⚠️ Couldn't generate image.")
      console.log("poli error:", e.message)
    }
  }
}
