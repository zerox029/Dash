const Commando = require("discord.js-commando");

module.exports = class PruneCommand extends Commando.Command
{
    constructor(client)
    {
        super(client, {
            name: "purge",
            aliases: ['p', 'prune'],
            group: "moderation",
            memberName: "prune",
            description: "Deletes the amount of messages specified",
            examples: ["purge {Message Count}", "purge 50"],
            clientPermissions: ['MANAGE_MESSAGES'],
            args: [
                {
                    key: 'amount',
                    prompt: 'How many messages do you want do delete?\n',
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
        try
        {
            message.channel.bulkDelete(args.amount + 1, true);
        }
        catch(err)
        {
            Console.log(err);
        }
    }
}