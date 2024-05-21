import {
    AudioPlayer,
    AudioPlayerStatus,
    StreamType,
    VoiceConnection,
    VoiceConnectionStatus,
    createAudioResource,
    entersState,
    joinVoiceChannel
} from "@discordjs/voice";
import { Message, VoiceBasedChannel } from "discord.js";
import { PaginatedResponse, Video } from "popyt";
import { createDiscordJSAdapter } from '../adapter';
import fs from 'fs'

import ytdl from "ytdl-core";

export class MusicClass {
    readonly player: AudioPlayer;
    queue: Video[];
    currentlyPlaying: Video | null;
    connection: VoiceConnection | null;
    currentPlayingMessage: Message | null;
    messageQueue: Message[];
    constructor() {
        this.player = new AudioPlayer;
        this.queue = [];
        this.currentlyPlaying = null;
        this.connection = null;
        this.currentPlayingMessage = null;
        this.messageQueue = [];
    }
    async connectToChannel(channel: VoiceBasedChannel) {
        const connection = joinVoiceChannel({
            channelId: channel.id,
            guildId: channel.guild.id,
            adapterCreator: createDiscordJSAdapter(channel),
        });

        try {
            await entersState(connection, VoiceConnectionStatus.Ready, 30_000);
            return connection;
        } catch (error) {
            connection.destroy();
            throw error;
        }
    }

    async connect(message: Message, servers: any) {
        this.connection = await this.connectToChannel(message.member?.voice.channel!);
        this.connection!.subscribe(this.player);
        this.connection.on('stateChange', (state) => {
            if (state.status === VoiceConnectionStatus.Disconnected) {
                servers[message.guild!.id] = null;
            }
        })
    }

    async prepareSong(songURL: string): Promise<AudioPlayer> {
        try {
            ytdl(
                songURL,
                {
                    filter: "audioonly",
                    quality: "highestaudio"
                }
            ).pipe(fs.createWriteStream('/tmp/song.mp3')).on('finish', () => {
                const r = fs.createReadStream('/tmp/song.mp3')
                const resource = createAudioResource(
                    r, {
                    inputType: StreamType.Arbitrary,
                });
                this.player.play(resource);
            });

        } catch (error) {
            console.error(error)
        }


        let state = await entersState(this.player, AudioPlayerStatus.Playing, 50000).catch(error => console.error(error))
        return state!;
    }
    async Queued(message: Message, song: Video): Promise<void | Message<boolean>> {
        return message.reply(`Queued: ${song.url}`)
            .catch((error) => { console.error(`ya ltif ${error}`) });
    }
    async playing(message: Message, song: Video): Promise<void | Message<boolean>> {
        return message.reply(`Playing: ${song.url}`)
            .catch(error => { console.error(`ya ltif ${error}`) });
    }
    printQueue() {
        this.queue.map(song => console.log(`URL: ${song.url}, TITLE: ${song.title}`));
    }
    async playSong(message: Message, servers: any): Promise<AudioPlayer> {
        if (this.currentPlayingMessage != null) {
            try {
                await this.currentPlayingMessage.delete();
            } catch (error) {
                console.error(error);
            }

        };
        this.prepareSong(this.queue[0].url).catch(error => console.error(error));
        this.currentlyPlaying = this.queue[0];
        this.currentPlayingMessage = await this.playing(message, this.queue[0]) || null;
        this.queue.shift();
        const callback = async () => {
            if (this.player.state.status === AudioPlayerStatus.Idle) {
                if (this.currentPlayingMessage != null) {
                    try {
                        await this.currentPlayingMessage.delete();
                    } catch (error) {
                        console.error(error);
                    }
                };
                if (this.queue[0]) {
                    this.currentlyPlaying = this.queue[0];
                    if (this.messageQueue[0]) {
                        try {
                            await this.messageQueue[0].delete();
                            this.messageQueue.shift();
                        } catch (error) {
                            console.error(error);
                        }
                    }
                    this.currentPlayingMessage = await this.playing(message, this.queue[0]) || null;
                    this.playSong(message, servers);
                    this.player.removeListener('stateChange', callback);
                } else {
                    message.reply('ma3adach fama songs fil queue, Hani 5arej').catch(error => { console.error(`ya ltif ${error}`) });
                    this.player.removeListener('stateChange', callback);
                    try {
                        this.player.stop();
                        this.connection!.destroy()
                        servers[message.guild!.id] = null;

                    } catch (error) {
                        console.error(error);
                    }
                }
            }
        }
        return this.player.on('stateChange', callback);
    }
    async play(message: Message, song: Video, servers: any): Promise<Number | Promise<AudioPlayer>> {
        if (this.connection?.state.status !== VoiceConnectionStatus.Ready) {
            this.connect(message, servers);
        }
        if (this.player.state.status === AudioPlayerStatus.Playing) {
            this.queue.push(song);
            let temp = await this.Queued(message, song);
            if (temp == null) {
                console.error("something went wrong");
            } else {
                this.messageQueue.push(temp);
            }
            return 0;
        } else {
            this.queue = [];
            this.queue.push(song);
            return this.playSong(message, servers);
        }
    }

    playList(message: Message, videos: PaginatedResponse<Video>, servers: any): Number | Promise<AudioPlayer> {
        if (this.connection?.state.status !== VoiceConnectionStatus.Ready) {
            this.connect(message, servers);
        }
        videos.items.map(video => this.queue.push(video))
        if (this.player.state.status === AudioPlayerStatus.Playing) {
            message.reply(`Queued Playlist`);
            return 0;
        }
        else {
            this.playing(message, this.queue[0]);
            return this.playSong(message, servers);
        }

    }

    async stop() {
        try {
            if (this.currentPlayingMessage != null) {
                try {
                    await this.currentPlayingMessage.delete();
                } catch (error) {
                    console.error(error);
                }
            };
            this.player.stop();
            this.connection!.destroy();

        } catch (error) {
            console.error(error);
        }
    }
    skip(skipAmount?: number) {
        try {
            if (skipAmount) {
                this.queue.splice(0, skipAmount);
                let skipped = this.messageQueue.splice(0, skipAmount);
                skipped.map(async x => await x.delete());
            } else {
                return this.player.stop(true);
            }
        } catch (error) {
            console.error(error);
        }

    }
    resume() {
        try {
            return this.player.unpause();
        } catch (error) {
            console.error(error);
        }
    }
    pause() {
        try {
            return this.player.pause(true);
        } catch (error) {
            console.error(error);
        }
    }
}
