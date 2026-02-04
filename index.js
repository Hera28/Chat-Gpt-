const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const { GoogleGenerativeAI } = require("@google/generative-ai");

const GEMINI_API_KEY = process.env.GEMINI_KEY; 
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

const TARGET_ID = "628195100562@c.us"; 

const client = new Client({
    authStrategy: new LocalAuth(),
    puppeteer: {
        headless: true,
        executablePath: process.env.PUPPETEER_EXECUTABLE_PATH || null,
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    }
});

client.on('qr', qr => {
    // Trik: small: false biar QR-nya lebih besar dan jelas di Logs
    qrcode.generate(qr, {small: false});
    console.log("GERCEP SCAN PAKE WA MARVEL!");
});

client.on('ready', () => {
    console.log('Clone Marvel Edmund Kumaat so aktif!');
});

client.on('message', async msg => {
    if (msg.from === TARGET_ID) {
        const chat = await msg.getChat();
        await chat.sendStateTyping();

        const prompt = `Nama kta Marvel Edmund Kumaat dari Manado. 
        Sifat: Big Brain, Jack of all trade, tapi malas. Suka Nailoong.
        Gaya bahasa: Manado kental (kta, nn, trng, drng, kwa, ca). 
        Suka sejarah, debat, jokes bapak-bapak, dan main game.
        Pesan: "${msg.body}"`;

        try {
            const result = await model.generateContent(prompt);
            await msg.reply(result.response.text());
        } catch (err) { console.log("Error: ", err); }
    }
});

client.initialize();
