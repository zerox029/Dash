const Commando = require("discord.js-commando");
const predict = require("eightball")

module.exports = class EightBallCommand extends Commando.Command
{
    constructor(client)
    {
        super(client, {
            name: "8ball",
            aliases: ['eightball'],
            group: 'fun',
            memberName: "8ball",
            description: "Decides your fate",
            examples: ["8ball {Question}", "8ball Do I know the way of life?"],
            args: [
                {
                    key: 'question',
                    prompt: 'What question would you like answered?\n',
                    type: 'string',
                }
            ]
        });
    }

    run(message, {question})
    {
        var reply = this.createReply(message, question);
        this.sendAndDeleteMessage(message, reply);
    }

    createReply(message, question)
    {
        var reply = message.author + " **asked**: " + question + "\n**Answer**: ";
        reply += predict();

        return reply;
    }

    sendAndDeleteMessage(message, reply)
    {
        message.say(reply);
        message.delete();
    }
}