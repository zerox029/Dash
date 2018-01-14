const { Command, util } = require("discord.js-commando"),
      { oneLine, stripIndents } = require('common-tags');

const { PAGINATED_ITEMS } = process.env;
const Song = require('../../Structs/Song');

module.exports = class QueueCommand extends Command
{
    constructor(client) {
		super(client, {
			name: 'queue',
			aliases: ['songs', 'song-list'],
			group: 'music',
			memberName: 'queue',
			description: 'Lists the queued songs.',
			guildOnly: true,
			throttling: {
				usages: 2,
				duration: 3
			},
			args: [
				{
					key: 'page',
					prompt: 'what page would you like to view?\n',
					type: 'integer',
					default: 1
				}
			]
		});
    } 
    
    run(message, {page})
    {
        const queue = this.queue.get(message.guild.id);
        if(!queue) return message.reply("The queue is currently empty");

        const paginated = util.paginate(queue.songs, page, Math.floor(PAGINATED_ITEMS));
        const totalLength = queue.songs.reduce((prev, song) => prev + song.length, 0);
        const currentSong = queue.songs[0];
        const currentTime = currentSong.dispatcher ? currentSong.dispatcher.time / 1000 : 0;

		return message.embed({
			color: 3447003,
			author: {
				name: `${message.author.tag} (${message.author.id})`,
				icon_url: message.author.avatarURL
			},
			description: stripIndents`
				__**Song queue, page ${paginated.page}**__
				${paginated.items.map(song => `**-** ${!isNaN(song.id) ? `${song.name} (${song.lengthString})` : `[${song.name}](${`https://www.youtube.com/watch?v=${song.id}`})`} (${song.lengthString})`).join('\n')}
				${paginated.maxPage > 1 ? `\nUse ${message.usage()} to view a specific page.\n` : ''}
				**Now playing:** ${!isNaN(currentSong.id) ? `${currentSong.name}` : `[${currentSong.name}](${`https://www.youtube.com/watch?v=${currentSong.id}`})`}
				${oneLine`
					**Progress:**
					${!currentSong.playing ? 'Paused: ' : ''}${Song.timeString(currentTime)} /
					${currentSong.lengthString}
					(${currentSong.timeLeft(currentTime)} left)
				`}
				**Total queue time:** ${Song.timeString(totalLength)}
			`
		});
    }

    get queue()
    {
        if(!this._queue) this._queue = this.client.registry.resolveCommand('music:play').queue;

        return this._queue;
    }
}