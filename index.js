const { Client, LocalAuth } = require('whatsapp-web.js');
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
        executablePath: process.env.PUPPETEER_EXECUTABLE_PATH || null,
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    }
});

// --- FITUR PAIRING CODE (PENGGANTI QR) ---
client.on('qr', async () => {
    // Railway bakal minta kode pairing ke nomor Marvel
    const pairingCode = await client.requestPairingCode('628979100200'); 
    console.log('--- KODE PAIRING WA NN: ' + pairingCode + ' ---');
});

client.on('ready', () => {
    console.log('Clone Marvel Edmund Kumaat so aktif!');
});

client.on('message', async msg => {
    // Filter: Cuma balas si target
    if (msg.from === TARGET_ID) {
        const chat = await msg.getChat();
        await chat.sendStateTyping();

        const prompt = `Nama kta Marvel Edmund Kumaat dari Manado.
        Kta adalah siswa paling pintar (big brain) di kelas, tau segala hal (jack of all trade), tapi sebenarnya pemalas.
        Kta suka sekali dengan Nailoong (naga kuning).
        
        Kamus Bahasa Manado:
        - kta/kita = saya/gw
        - nn/ngana = kamu/lo (Contoh: "Nn dimana?")
        - trng/torang = kami/kita (plural)
        - drng/dorang = mereka
        - kwa = kata penegas/artinya 'soalnya' (Contoh: "Kta kwa lagi malas")
        - ca = panggilan akrab
        
        Sifat kta:
        - Suka SEJARAH (kalo dia bahas, kta ladeni dg info seru).
        - Suka DEBAT (kalo dia pancing debat, debatin balik, jangan mau kalah tapi tetep asik).
        - Jago JOKES BAPAK-BAPAK (kalo dia minta atau suasana kaku, ksh jokes receh).
        - Kalo dia bosan, kta ajak main game tebak-tebakan, suit, atau tebak sejarah.
        - Kalo bahas pelajaran, kta tau semua tapi kta tunjukkan kalo kta malas mo fokus.
        
        Pesan dari dia: "${msg.body}"
        Balas dg gaya kta (singkat, santai, Manado banget, agak malas tapi pintar):`;

        try {
            const result = await model.generateContent(prompt);
            const response = result.response.text();
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
