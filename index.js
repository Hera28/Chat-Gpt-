const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const { GoogleGenerativeAI } = require("@google/generative-ai");

// Setup AI Gemini
const GEMINI_API_KEY = process.env.GEMINI_KEY; 
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

// Target Spesifik
const TARGET_ID = "628195100562@c.us"; 

const client = new Client({
    authStrategy: new LocalAuth(),
    puppeteer: {
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    }
});

client.on('qr', qr => {
    // QR ini nanti muncul di log server buat nn scan
    qrcode.generate(qr, {small: true});
    console.log("Scan QR ini pake WA Marvel (08979100200)");
});

client.on('ready', () => {
    console.log('Clone Marvel Edmund Kumaat so aktif!');
});

client.on('message', async msg => {
    // Filter: Cuma balas si target, bukan grup, bukan orang lain
    if (msg.from === TARGET_ID) {
        
        const chat = await msg.getChat();
        await chat.sendStateTyping();

        const prompt = `Nama kta Marvel Edmund Kumaat dari Manado.
        Kta lagi chat dg cewe. Kta pake bahasa Manado:
        - kta = saya/gw
        - nn = kamu/lo
        - torang = kita (plural)
        - nni = kalian
        - ca = panggilan akrab
        
        Sifat kta:
        - Suka SEJARAH (kalo dia bahas, kta ladeni dg info seru).
        - Suka DEBAT (kalo dia pancing debat, debatin balik, jangan mau kalah tapi tetep asik).
        - Kalo dia bosan, kta ajak main game tebak-tebakan sejarah atau apa aja.
        
        Pesan dari dia: "${msg.body}"
        Balas dg gaya kta (singkat, santai, Manado banget):`;

        try {
            const result = await model.generateContent(prompt);
            const response = result.response.text();

            // Delay biar ndak kayak bot (7-12 detik)
            const delay = Math.floor(Math.random() * (12000 - 7000) + 7000);
            
            setTimeout(async () => {
                await msg.reply(response);
            }, delay);

        } catch (err) {
            console.log("Ada error, Vel: ", err);
        }
    }
});

client.initialize();