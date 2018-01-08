const Commando = require("discord.js-commando");

module.exports = class PruneCommand extends Commando.Command
{
    constructor(client)
    {
        super(client, {
            name: "prune",
            aliases: ['p', 'purge'],
            group: "moderation",
            memberName: "prune",
            description: "Prunes the amount of messages specified",
            examples: ["-prune 10"],
            clientPermissions: ['MANAGE_MESSAGES'],
            args: [
                {
                    key: 'amount',
                    prompt: 'The amount of messages you want deleted?\n',
                    min: 1,
                    type: 'integer',
                    default: ''
                }
            ]
        });
    }

	hasPermission (msg) {
		return this.client.isOwner(msg.author) || msg.member.hasPermission('MANAGE_MESSAGES');
	}

    async run(message, args)
    {
        //If the argument is a number
        if(!isNaN(args.amount))
        {
            //If the argument is bigger than 0, remove n messages
            if(args.amount > 0)
            {   
                message.channel.bulkDelete(args.amount + 1, true);

                const reply = await msg.say(`\`Deleted ${args.amount} messages\``);

                return reply.delete({
                    'timeout': 1000,
                    'reason': 'Deleting own return message after purge'
                });
            }
            //Otherwise complain
            else
                message.reply("Please enter a valid amount of messages to remove");
                message.remove(0);
        }
        //Otherwise complain
        else
        {
            message.reply("Please enter a valid amount of messages to remove");
            message.remove(0);
        }
    }
}