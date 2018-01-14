const Commando = require("discord.js-commando");

module.exports = class ResumeCommand extends Commando.Command
{
    constructor(client){
        super(client, {
            name: "resume",
            group: "music",
            memberName: "resume",
            description: "resume a paused song",
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

    run(message, args)
    {
        const queue = this.queue.get(message.guild.id);
        if(!queue) return message.reply("There is no music to resume.");
        if(!queue.songs[0].dispatcher) return message.reply("The song hasn't even begun yet.");
        if(queue.songs.playing) return message.reply("No song has been paused");
        queue.songs[0].dispatcher.resume();
        queue.songs[0].playing = true;

        return message.reply('I resumed the music');
    }

    get queue()
    {
        if (!this._queue) this._queue = this.client.registry.resolveCommand('music:play').queue;

		return this._queue;
    }
}