const Commando = require("discord.js-commando");

module.exports = class DiceRollCommand extends Commando.Command
{
    constructor(client)
    {
        super(client, {
            name: "avatar",
            group: 'util',
            memberName: "avatar",
            description: "Retrives a profile picture",
            examples: ["avatar @user"],
            args: [
                {
                    key: 'user',
                    prompt: 'Whose avatar do you want to see?\n',
                    type: 'user'
                }
            ]
        });
    }

    run(message, args)
    {
        try
        {
            message.say(args.user.avatarURL);
        }
        catch(err)
        {
            message.reply("Sorry! I could not fetch the desired avatar");
        }
    }
}