const Commando = require("discord.js-commando");

module.exports = class BanCommand extends Commando.Command
{
    constructor(client)
    {
        super(client, {
            name: "ban",
            group: 'moderation',
            memberName: "ban",
            description: "Bans a user from the server",
            examples: ["ban @user"],
            args: [
                {
                    key: 'user',
                    prompt: 'Who do you want to ban?\n',
                    type: 'member'
                },
                {
                    key: 'reason',
                    prompt: 'Why do you want to ban this user?\n',
                    type: 'string'
                }
            ]
        });
    }

	hasPermission (msg) {
		return this.client.isOwner(msg.author) || msg.member.hasPermission('BAN_MEMBERS');
	}

    run(message, {user, reason})
    {
        try
        {   
            var senderHighestRole = message.member.highestRole.position;
            var toBanHighestRole = user.highestRole.position;
            
            if(senderHighestRole > toBanHighestRole && user.bannable)
            {
                user.ban(reason);
                message.say(user.displayName + " has been banned for the following reason: " + reason);
            }
            else
            {
                message.reply("Sorry! You cannot ban someone who is higher ranked than you.");
            }
        }
        catch(err)
        {
            message.reply("Sorry! I could not ban the specified user");
            console.log(err);
        }
    }
}