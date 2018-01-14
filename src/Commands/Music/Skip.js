const Commando = require("discord.js-commando"),
      { oneLine } = require('common-tags');

module.exports = class OxrCommand extends Commando.Command
{
    constructor(client)
    {
        super(client, {
            name: "skip",
            group: 'music',
            memberName: "skip",
            description: "Skips the song that is currently playing.",
            details: oneLine`
            If there are 3 people or fewer (excluding the bot) in the voice channel, the skip will be immediate.
            With at least 4 people, a voteskip will be started with 15 seconds to accept votes.
            The required votes to successfully skip the song is one-third of the number of listeners, rounded up.
            Each vote will add 5 seconds to the vote's timer.
            Moderators can use the "force" parameter, which will immediately skip without a vote, no matter what.
            `,
            guildOnly: true,
            throttling: {
                usages: 2,
                duration: 3
            }
        });

        this.votes = new Map();
    }

    run(message, args)
    {
        const queue = this.queue.get(message.guild.id);
        if(!queue) return message.reply("There is no song playing right now...");
        if(!queue.voiceChannel.members.has(message.author.id))
        {
            return message.reply("You're not even in the voice channel");
        }
        if(!queue.songs[0].dispatcher) return message.reply("The song hasn't even begun yet...");

        const threshold = Math.ceil((queue.voiceChannel.members.size - 1) / 3);
        const force = threshold <= 1 
                || queue.voiceChannel.members.size < threshold 
                || (message.member.hasPermission('MANAGE_MESSAGES')
                && args.ToLowerCase() === 'force');
        if(force) return message.reply(this.skip(message.guild, queue));

        const vote = this.votes.get(message.guild.id);
        if(vote && vote.count >= 1)
        {
            if(vote.users.some(user => user === message.author.id)) return message.reply("You've already voted to skip the song");

            vote.count++;
            vote.users.push(message.author.id);
            if(vote.count >= threshold) return message.reply(this.skip(message.guild, queue));

            const time = this.setTimeout(vote);
            const remaining = threshold - vote.count;

            return msg.say(oneLine`
                ${vote.count} vote${vote.count > 1 ? 's' : ''} received so far,
                ${remaining} more ${remaining > 1 ? 'are' : 'is'} needed to skip.
                Five more seconds on the clock! The vote will end in ${time} seconds.
            `);
        }
        else
        {
            const newVote = {
                count: 1,
                users: [message.author.id],
                queue, 
                guild: message.guild.id,
                start: Date.now(),
                timeout: null
            };

            const time = this.setTimeout(newVote);
            this.votes.set(message.guild.id, newVote);
            const remaining = threshold - 1;

            return msg.say(oneLine`
                Starting a voteskip.
                ${remaining} more vote${remaining > 1 ? 's are' : ' is'} required for the song to be skipped.
                The vote will end in ${time} seconds.
            `);
        }
    }

    skip(guild, queue)
    {
        console.log(queue);
        if(this.votes.has(guild.id))
        {
            clearTimeout(this.votes.get(guild.id.timeout));
            this.votes.delete(guild.id);
        }

        const song = queue.songs[0];
        song.dispatcher.end();

        return `Skipped: **${song}**`;
    }

    setTimeout(vote)
    {
        const time = vote.start + 1500 - Date.now() + ((vote.count - 1) * 5000);
        clearTimeout(vote.timeout);
        vote.timeout = setTimeout(() => {
            this.votes.delete(vote.guild);
            vote.queue.textChannel.send("The vote to skip the current song has ended.");
        }, time);

        return Math.round(time / 1000);
    }

    get queue()
    {
        if(!this._queue) this._queue = this.client.registry.resolveCommand('music:play').queue;

        return this._queue;
    }
}