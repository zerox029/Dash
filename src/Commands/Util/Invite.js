const Commando = require("discord.js-commando");

module.exports = class InviteCommand extends Commando.Command
{
    constructor(client)
    {
        super(client, {
            name: "invite",
            aliases: ['link'],
            group: 'util',
            memberName: "invite",
            description: "To invite me in your server (◕ᴗ◕✿)",
        });
    }

    async run(message, args)
    {
        try
        {
            message.author.send("__You can use the following link to invite me in your own server__\n\n" + "https://discordapp.com/oauth2/authorize?client_id=399705801717186571&scope=bot&permissions=2146958583")
            message.delete();
        }
        catch(err)
        {
            message.reply("Sorry! I could not deliver the information to your DMs");
        }
    }
}