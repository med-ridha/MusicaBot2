import ytdl from "@distube/ytdl-core";
import fs from 'fs'
import { Message } from "discord.js";
import { YouTube, Video } from 'popyt';
const search = new YouTube(process.env.YoutubeAPIKEY);
let searchResults: Video[];
let messageCache: Message;

export async function chooseSong(songName: string, message: Message): Promise<Message> {

    await search.searchVideos(songName,).then(async (results) => {
        if (results.items.length === 0) {
            message.reply("No results found")
            return;
        } else {
            let response = "Choose a song by typing the number\n"
            for (let i = 0; i < 10; i++) {
                response += `${i + 1}. ${results.items[i].title}\n`
            }
            messageCache = await message.reply(response);
            searchResults = results.items.slice(0, 10);
        }
    }).catch((error) => {
        console.error(error)
    });
    return messageCache;
}

export async function sendSong(message: Message, index?: number, content?: string): Promise<void> {
    let songURL = content ? content : searchResults[index!].url;
    message.reply(`Downloading the song... ${songURL}`);
    try {
        let mes = await message.reply("Working on it...");
        ytdl(
            songURL,
            {
                filter: "audioonly",
                quality: "highestaudio"
            }
        ).pipe(fs.createWriteStream('/tmp/test.mp3')).on('finish', async () => {
            mes.delete();
            mes = await message.reply('Almost there...');
            try {
                await message.reply({
                    files: [`/tmp/download.mp3`]
                });

            } catch (error) {
                message.reply("Something went wrong! oops...");
            }
            mes.delete();
            return;
        });
    } catch (error) {
        console.error(error)
    }
}
