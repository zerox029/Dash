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
            examples: ["8ball {Question}", "8ball Did somebody toucha my spaghet?"],
            args: [
                {
                    key: 'question',
                    prompt: 'What question would you like answered?\n',
                    type: 'string',
                },
            ]
        });
    }

    async run(message, args)
    {
        var reply = message.author + " **asked**: " + args.question + "\n**Answer**: ";
        reply += predict();

        message.channel.send(reply);
        message.delete();
    }
}