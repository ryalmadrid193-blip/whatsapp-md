import makeWASocket, { useMultiFileAuthState, fetchLatestBaileysVersion } from "@whiskeysockets/baileys"

async function startBot() {
  const { state, saveCreds } = await useMultiFileAuthState('./auth')
  const { version } = await fetchLatestBaileysVersion()
  
  const sock = makeWASocket({
    auth: state,
    version,
    printQRInTerminal: true
  })

  sock.ev.on('creds.update', saveCreds)

  sock.ev.on('messages.upsert', async ({ messages }) => {
    const msg = messages[0]

    if (!msg.message) return

    const from = msg.key.remoteJid
    const text = msg.message.conversation || msg.message.extendedTextMessage?.text

    if (!text) return

    // أمر بسيط للرد
    if (text.toLowerCase() === "مرحبا") {
      await sock.sendMessage(from, { text: "أهلاً بك! كيف أساعدك؟" })
    }

    // مثال: أمر كتم عضو (لن يعمل إلا بصلاحيات)
    if (text.startsWith("!كتم")) {
      await sock.sendMessage(from, { text: "تم تنفيذ أمر الكتم (تجريبي)" })
    }
  })
}

startBot()
