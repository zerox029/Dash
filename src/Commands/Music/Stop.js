const Commando = require('discord.js-commando');

module.exports = class StopMusicCommand extends Commando.Command
{
	constructor(client) {
		super(client, {
			name: 'stop',
			aliases: ['kill'],
			group: 'music',
			memberName: 'stop',
			description: 'Stops the music and wipes the queue.',
			details: 'Only moderators may use this command.',
			guildOnly: true,
			throttling: {
				usages: 2,
				duration: 3
			}
		});
    }
    
    hasPermission(message)
    {
        return this.client.isOwner(message.author) || message.member.hasPermission('MANAGE_MESSAGES');
    }

    run(message)
    {
        const queue = this.queue.get(message.guild.id);
        if(!queue) return message.reply("There isn't any music playing right now");
        const song = queue.songs[0];
        queue.songs = [];
        if(song.dispatcher) song.dispatcher.end();

        return msg.reply("you've just killed the party. Congrats. 👏");
    }

    get queue()
    {
        if(!this._queue) this._queue = this.client.registry.resolveCommand('music:play').queue;

        return this._queue;
    }
}