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
            examples: ["-purge 10"],
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
        message.channel.bulkDelete(args.amount + 1, true);

        // return reply.delete({
        //     'timeout': 1000,
        //     'reason': 'Deleting own return message after purge'
        // });
    }
}