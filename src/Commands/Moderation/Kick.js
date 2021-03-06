const Commando = require("discord.js-commando");

module.exports = class KickCommand extends Commando.Command
{
    constructor(client)
    {
        super(client, {
            name: "kick",
            group: 'moderation',
            memberName: "kick",
            description: "Kicks a user from the server",
            examples: ["kick @user"],
            args: [
                {
                    key: 'user',
                    prompt: 'Who do you want to kick?\n',
                    type: 'member'
                },
                {
                    key: 'reason',
                    prompt: 'Why do you want to kick this user?\n',
                    type: 'string'
                }
            ]
        });
    }

	hasPermission (msg) {
		return this.client.isOwner(msg.author) || msg.member.hasPermission('KICK_MEMBERS');
	}

    run(message, {user, reason})
    {
        try
        {
            var senderHighestRole = message.member.highestRole.position;
            var toBanHighestRole = user.highestRole.position;
            
            if(senderHighestRole > toBanHighestRole && member.kickable)
            {
                user.kick(reason);
                message.say(user.displayName + " has been kicked for the following reason: " + reason);
            } 
            else
            {
                message.reply("Sorry! You cannot kick someone who is higher ranked than you.");
            }       
        }
        catch(err)
        {
            message.reply("Sorry! I could not kick the specified user");
            console.log(err);
        }
    }
}