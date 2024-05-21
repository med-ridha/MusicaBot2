require('dotenv').config();
import { Client, GatewayIntentBits, Message } from 'discord.js';
import { handleCommands } from './lib/commands'

const token = process.env.DiscordAPIKEY;

const prefix = '+';

const client = new Client({
    intents: [
        GatewayIntentBits.DirectMessages,
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildVoiceStates,
        GatewayIntentBits.MessageContent
    ],
});

client.on('ready', async () => {
    console.log('Discord.js client is ready!');

});

client.on('messageCreate', async (message: Message) => {
    if (!message.guild) return;

    const channel = message.member?.voice.channel;
    let content = message.content;
    if (content.substring(0, 1) === prefix) {
        handleCommands(message, content, channel!);
    }
    return;
});

void client.login(token);
