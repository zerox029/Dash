const Commando = require("discord.js-commando");

module.exports = class SayCommand extends Commando.Command
{
    constructor(client)
    {
        super(client, {
            name: "say",
            group: 'util',
            memberName: "say",
            description: "Sends a message in the specified channel",
            examples: ["say #general Well hello there"],
            args: [
                {
                    key: 'channel',
                    prompt: 'Which channel do you want to send the message to?\n',
                    type: 'channel'
                },
                {
                    key: 'content',
                    prompt: 'What message would you like me to send?\n',
                    type: 'string'
                }
            ]
        });
    }

    run(message, {channel, content})
    {
        try
        {
            channel.send(content);
        }
        catch(err)
        {
            message.reply("Sorry, I could not send the message")
        }
    }
}