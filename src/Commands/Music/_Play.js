// const Commando = require("discord.js-commando"),
//       ytdl = require("ytdl-core"),
//       Youtube = require("simple-youtube-api"),
//       { oneLine, stripIndents } = require("common-tags");

// const Song = require('../../structs/Song');
// const PASSES = process.env;

// module.exports = class PlayCommand extends Commando.Command
// {
//     constructor(client)
//     {
//         super(client, {
//             name: "play",
//             group: 'music',
//             memberName: "play",
//             description: "Plays music from youtube",
//             examples: ["play {title}"],
//             args: [
//                 {
//                     key: 'url',
//                     prompt: 'What song would you like to listen to?\n',
//                     type: 'string'
//                 }
//             ]
//         });
        
//         this.queue = new Map();
//         this.youtube = new Youtube(process.env.YOUTUBE_API_KEY);
//     }

//     async run(message, args)
//     {
// 		const url = args.url.replace(/<(.+)>/g, '$1');
// 		const queue = this.queue.get(message.guild.id);

//         //Make sure the user is in a voice channel
//         var voiceChannel = message.member.voiceChannel;
//         if(!voiceChannel)
//         {
//             return message.reply("You must be in a voice channel");
//         }

//         //Checking for if the bot has JOIN and SPEAK permissions
//         const permissions = voiceChannel.permissionsFor(message.client.user);
//         var hasPermissions = this.checkPermissions(permissions);
//         if(!hasPermissions)
//         {
//             return;
//         }

//         const statusMessage = await message.reply('Obtaining video details...');
        
//         try
//         {
//             const video = await this.youtube.getVideo(url);
//             return this.handleVideo(video, queue, voiceChannel, message, statusMessage)
//         }
//         catch(err)
//         {
//             try
//             {
//                 const videos = await this.youtube.searchVideos(url, 1)
//                     .catch(() => statusMessage.edit(`${msg.author}, there were no search results.`));
//                 const video2 = await this.youtube.getVideoByID(videos[0].id);

//                 return this.handleVideo(video2, queue, voiceChannel, message, statusMessage);
//             }
//             catch(err)
//             {
//                 return statusMessage.edit(`${msg.author}, couldn't obtain the search result video's details.`);
//             }
//         }
//     }

//     checkPermissions(permissions)
//     {
//         if(!permissions.hasPermission('CONNECT'))
//         {
//             message.reply("I do not have permission to join your voice channel");
//             return false;
//         }
//         if(!permissions.hasPermission('SPEAK'))
//         {
//             message.reply("I do not have permission to speak in your voice channel");
//             return false;
//         }

//         return true;
//     }

//     async handleVideo(video, queue, voiceChannel, message, statusMessage)
//     {
//         if(video.duration === 0)
//         {
//             statusMsg.edit(`${msg.author}, you can't play live streams.`);

// 			return null;
//         }

//         if(!queue)
//         {
//             queue = {
//                 textChannel: message.channel,
//                 voiceChannel,
//                 connection: null,
//                 songs: []
//             };
//             this.queue.set(message.guild.id, queue);

//             const result = await this.addSong(message, video);
//             const resultMessage = {
// 				color: 3447003,
// 				author: {
// 					name: `${message.author.tag} (${message.author.id})`,
// 					icon_url: message.author.avatarURL
// 				},
// 				description: result
//             };

//              if(!result.startsWith('👍'))
//              {
//                  this.queue.delete(message.guild.id);
//                  statusMessage.edit('', { embed: resultMessage });

//                  return null;
//              }

//             statusMessage.edit(`${message.author}, joining your voice channel...`);
//             try
//             {
//                 const connection = await queue.voiceChannel.join();
//                 queue.connection = connection;
//                 this.play(message.guild, queue.songs[0]);
//                 statusMessage.delete();

//                 return null
//             }
//             catch(err)
//             {
//                 this.queue.delete(message.guild.id);
// 				statusMessage.edit(`${message.author}, unable to join your voice channel.`);
//                 console.log(err);
// 				return null;
//             }
//         }
//         else
//         {
//             const result = await this.addSong(message, video);
//             const resultMessage = {
//                 color: 3447003,
// 				author: {
// 					name: `${message.author.tag} (${message.author.id})`,
// 					icon_url: message.author.avatarUR
// 				},
// 				description: result
//             };
//             statusMessage.edit('', { embed: resultMessage });

//             return null;
//         }
//     }

//     addSong(message, video)
//     {
//         const queue = this.queue.get(message.guild.id);

//         if(!this.client.isOwner(message.author))
//         {
//             const songMaxLength = 30;
//             if(songMaxLength > 0 && video.durationSeconds > songMaxLength * 60)
//             {
//                 return oneLine`
//                     👎 ${escapeMarkdown(video.title)}
//                     (${Song.timeString(video.durationSeconds)})
//                     is too long. No songs longer than ${songMaxLength} minutes!
//                 `;
//             }
//             if(queue.songs.some(song => song.id === video.id))
//             {
//                 return `👎 ${escapeMarkdown(video.title)} is already queued.`;
//             }

//             const maxQueueLength = 10;
//             if(maxQueueLength > 0 && queue.songs.reduce((prev, song) => prev + song.member.id === message.author.id, 0) >= maxQueueLength)
//             {
//                 return `👎 you already have ${maxQueueLength} songs in the queue.`;
//             }
//         }

//         const song = new Song(video, message.member);
//         queue.songs.push(song);

//         return oneLine`
//             👍 ${song.url.match(/^https?:\/\/(api.soundcloud.com)\/(.*)$/) ? `${song}` : `[${song}](${`${song.url}`})`}
//         `;
//     }

//     play(guild, song)
//     {
//         const queue = this.queue.get(guild.id);

//         //If the queue is empty
//         if(!song)
//         {
//             queue.textChannel.say("We've run out of music.");
//             queue.voiceChannel.leave();
//             this.queue.delete(guild.id);
//             return;
//         }

//         const playing = queue.textChannel.send({
//             embed: {
// 				color: 3447003,
// 				author: {
// 					name: song.username,
// 					icon_url: song.avatar
// 				},
// 				description: `
// 					${song.url.match(/^https?:\/\/(api.soundcloud.com)\/(.*)$/) ? `${song}` : `[${song}](${`${song.url}`})`}
// 				`,
// 				image: { url: song.thumbnail }
// 			}
//         });
//         let stream;
//         let streamErrored = false;
//         if(song.url.match(/^https?:\/\/(api.soundcloud.com)\/(.*)$/))
//         {
//             stream = request({
//                 uri: song.url,
//                 headers: { 'User-Agent': `Commando v${version} (https://github.com/WeebDev/Commando/)` },
//                 followAllRedirects: true
//             });
//         }
//         else
//         {
//             stream = ytdl(song.url, {audioonly: true})
//                     .on('error', err => {
//                         streamErrored = true;
//                         playing.then(message => message.edit(`❌ Couldn't play ${song}. What a drag!`));
//                         queue.songs.shift();
//                         this.play(guild, queue.songs[0]); 
//                     });
//         }
        
//         const dispatcher = queue.connection.playStream(stream, {passes: PASSES})
//                 .on('end', () => {
//                     if(streamErrored) return;
//                     queue.songs.shift();
//                     this.play(guild, queue.songs[0]);
//                 })
//                 .on('error', () => {
//                     queue.textChannel.say("An error has occured while playing the song: \`${err}\`");
//                 });
//         queue.connection.player.opusEncoder.setPLP(0.01);
//         dispatcher.setVolumeLogarithmic(queue.volume / 5);
//         song.dispatcher = dispatcher;
//         song.playing = true;
//     }
// }