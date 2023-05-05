const { Telegraf } = require("telegraf")
const dotenv = require("dotenv")
const axios = require('axios');

dotenv.config()

const bot = new Telegraf(process.env.TOKEN)

const adminsId = [6299965585]

const instaDownloader = async (instaUrl) => {
    const options = {
        method: 'GET',
        url: 'https://instagram-downloader-download-instagram-videos-stories.p.rapidapi.com/index',
        params: {
            url: `${instaUrl}`
        },
        headers: {
            'X-RapidAPI-Key': '901af23752msh7c051f4139a8db7p13ac8djsn2345135172bb',
            'X-RapidAPI-Host': 'instagram-downloader-download-instagram-videos-stories.p.rapidapi.com'
        }
    };

    try {
        const response = await axios.request(options);
        return response.data
    } catch (error) {
        console.error(error);
    }
}

bot.use((ctx, next) => {
    if (ctx.message && !ctx.state.monjo) {
        adminsId.forEach(item => {
            bot.telegram.sendMessage(item, `Sizga ${ctx.message.from.first_name} => @${ctx.message.from.username} Botga yuboordi ! ${ctx.message.text}`)
        })
        ctx.reply(`Assalomu alekom ${ctx.message.from.first_name}\nBot instagramdan video yuklaydi foydalanish uchun\nAdminning instagram sahifasiga obuna bo'lib botga\nScreenShot yuborishingiz kerak, <a href="https://www.instagram.com/abdukar1mov_08">obuna bo'ling !</a>`, {
            parse_mode: "HTML"
        })
        next()
    }
    else {
        next()
    }
})

bot.start((ctx) => {
    ctx.state.mojno = false
    ctx.reply(`Assalomu alekom ${ctx.message.from.first_name}\nBot instagramdan video yuklaydi foydalanish uchun\nAdminning instagram sahifasiga obuna bo'lib botga\nScreenShot yuborishingiz kerak, <a href="https://www.instagram.com/abdukar1mov_08">obuna bo'ling !</a>`, {
        parse_mode: "HTML"
    })
})

bot.help((ctx) => {
    ctx.reply(`/start - Botni Boshlash !\n/help - Shu command !`)
})

bot.on("callback_query", (ctx) => {
    console.log(ctx.callbackQuery.data)
    if (ctx.callbackQuery.data === "yes") {
        ctx.state.mojno = true
        ctx.reply("Qaroringizni qo'llab quvatlayman uchun rahmat !")
    } else {
        ctx.state.mojno = false
        ctx.reply("Qaroringizni qo'llab quvatlayman uchun rahmat !")
    }
})

bot.on("message", (ctx) => {
    try {
        const videoUrl = ctx.message.text
        const videoId = instaDownloader(videoUrl)
        videoId.then(item => {
            console.log(item)
            ctx.sendVideo(item.media, {
                caption: "@instasavedurlbot-<b>dan yuklab olindi !</b>",
                parse_mode: "HTML"
            })
        })
    } catch (err) {
        console.log(err)
    }
})

bot.launch()