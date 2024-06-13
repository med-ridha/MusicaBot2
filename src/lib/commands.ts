import { Message, VoiceBasedChannel } from "discord.js";
import { play, stop, skip, resume, pause } from "./music";
import { scan, supportedLanguages } from "./ocr";
import { qrcode } from "./qrcode";
import { chooseSong, sendSong } from "./song";
import { getAccessToken, getTrackInfo } from "./spotify";
let token: string;
getAccessToken().then((token) => {
    token = token;
});
setTimeout(async () => {
    token = await getAccessToken();
}, 3500)
let waitingForResponse = false;
let messageCache: Message;
export async function handleCommands(message: Message, content: string, channel: VoiceBasedChannel) {
    content = content.substring(1,);
    let args = content.split(" ");
    let command = args.shift();
    content = args.join(" ");

    switch (command) {
        case "track":
            if (!args[0]) {
                message.reply("no track id detected");
                return;
            }
            if (!token) {
                message.reply("please wait a few seconds before trying again");
                return;
            }
            try {
                const trackName = await getTrackInfo(args[0], token);
                message.reply(trackName);
            } catch (error) {
                console.error(error);
            }
            break;
        case "7ot":
            if (!channel) {
                message.reply('od5el lel voice w 3awed jareb');
                return;
            }
            try {
                play(message, content)
            } catch (error) {
                console.error(error);
            }
            break;
        case "o5rej":
            if (!channel) {
                message.reply('od5el lel voice w 3awed jareb');
                return;
            }
            try {
                stop(message);
            } catch (error) {
                console.error(error)
            }
            break;
        case "3adi":
            if (!channel) {
                message.reply('od5el lel voice w 3awed jareb');
                return;
            }
            try {
                skip(message, args[0] as unknown as number);
            } catch (error) {
                console.error(error);
            }
            break;
        case "a9ef":
            if (!channel) {
                message.reply('od5el lel voice w 3awed jareb');
                return;
            }
            try {
                pause(message);
            } catch (error) {
                console.error(error);
            }
            break;
        case "kamel":
            if (!channel) {
                message.reply('od5el lel voice w 3awed jareb');
                return;
            }
            try {
                resume(message);
            } catch (error) {
                console.error(error);
            }
            break;
        case "scan":
            if (message.attachments.size > 1) {
                message.reply("one image at a time!");
                return;
            }
            if (message.attachments.size < 1) {
                message.reply("i require at least one image!");
                return;
            }
            if (!args[0]) {
                message.reply("no language detected, default English");
            }
            const image = message.attachments.first();
            if (!image) return;
            let lang = args[0] || "english";
            const result = await scan(image, lang)
            if (result == null) {
                message.reply("something went wrong!!!");
                return;
            }
            message.reply(result.data.text);
            break;
        case "lang":
            const langs = supportedLanguages();
            console.log(langs)
            message.reply(langs);
            break;
        case "qrcode":
            if (!args[0]) {
                message.reply("no message detected");
                return;
            }
            await qrcode(content);
            message.channel.send({
                files: ["./qrcode.png"]
            })
            break;
        case 'download':
            try {
                if (content.includes('https://')) {
                    await sendSong(message, undefined, content);
                    break;
                }
                if (waitingForResponse) {
                    waitingForResponse = false;
                    messageCache.delete();
                    let index = parseInt(args[0]) - 1;
                    await sendSong(message, index, undefined);
                    break;
                }
                waitingForResponse = true;
                messageCache = await chooseSong(content, message);
            } catch (error) {
                console.error(error)
            }
            break;
    }
}
