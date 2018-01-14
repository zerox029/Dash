const Commando = require('discord.js-commando'),
      { stripIndents } = require('common-tags');

const Song = require('../../Structs/Song');

module.exports = class MusicStatusCommand extends Commando.Command
{
	constructor(client) {
		super(client, {
			name: 'status',
			aliases: ['song', 'playing', 'current-song', 'now-playing'],
			group: 'music',
			memberName: 'status',
			description: 'Shows the current status of the music.',
			guildOnly: true,
			throttling: {
				usages: 2,
				duration: 3
			}
        });
    }

    run(message)
    {
        const queue = this.queue.get(message.guild.id);
        if(!queue) return message.reply("There isn't any music playing right now.");
        const song = queue.songs[0];
        const currentTime = song.dispatcher ? song.dispatcher.time / 1000 : 0;

        const embed = this.createResponse(song, currentTime);

        return message.embed(embed);
    }

    createResponse(song, currentTime)
    {
        const embed = {
			color: 3447003,
			author: {
				name: `${song.username}`,
				icon_url: song.avatar
			},
			description: stripIndents`
				${song.url.match(/^https?:\/\/(api.soundcloud.com)\/(.*)$/) ? `${song}` : `[${song}](${`${song.url}`})`}
				We are ${Song.timeString(currentTime)} into the song, and have ${song.timeLeft(currentTime)} left.
				${!song.playing ? 'The music is paused.' : ''}
			`,
			image: { url: song.thumbnail }
        };
        
        return embed;
    }

    get queue()
    {
        if(!this._queue) this._queue = this.client.registry.resolveCommand('music:play').queue;

        return this._queue;
    }
}