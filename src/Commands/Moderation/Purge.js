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
                    type: 'integer'
                }
            ]
        });
    }

	hasPermission (msg) {
		return this.client.isOwner(msg.author) || msg.member.hasPermission('MANAGE_MESSAGES');
	}

    async run(message, {amount})
    {
        try
        {
            message.channel.bulkDelete(amount + 1, true);
        }
        catch(err)
        {
            console.log(err);
        }
    }
}