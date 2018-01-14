const Commando = require("discord.js-commando");

module.exports = class PauseCommand extends Commando.Command
{
    constructor(client){
        super(client, {
            name: "pause",
            group: "music",
            memberName: "pause",
            description: "Pauses the currently playing song",
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
        if(!queue) return message.reply("There is no music to pause.");
        if(!queue.songs[0].dispatcher) return message.reply("The song hasn't even begun yet.");
        if(!queue.songs[0].playing) return message.reply("I don't think it is a good idea to pause an already paused song");
        queue.songs[0].dispatcher.pause();
        queue.songs[0].playing = false;
        return message.reply(`paused the music. Use \`${this.client.commandPrefix}resume\` to continue playing.`);
    }

    get queue()
    {
        if (!this._queue) this._queue = this.client.registry.resolveCommand('music:play').queue;

		return this._queue;
    }
}