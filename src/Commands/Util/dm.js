const Commando = require("discord.js-commando");

module.exports = class DiceRollCommand extends Commando.Command
{
    constructor(client)
    {
        super(client, {
            name: "dm",
            aliases: ['pm', 'message'],
            group: 'util',
            memberName: "dm",
            description: "Sends a private message to someone",
            examples: ["dm @user Hey there!"],
            args: [
                {
                    key: 'recipient',
                    prompt: 'Who do you want me to send the DM to?\n',
                    type: 'user'
                },
                {
                    key: 'content',
                    prompt: 'What message would you like me to send?\n',
                    type: 'string'
                }
            ]
        });
    }

    run(message, {recipient, content})
    {
        try
        {
            recipient.send(content);
            message.delete();
        }
        catch(err)
        {
            message.reply("Sorry! I could not send the DM");
            console.log(err);
        }
    }

    createMessage(content, sender)
    {
        var message = sender + " has asked me to send tell you the following: \n" + content;
        return message;
    }
}