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
        var embed = this.createReply(message, question);
        this.sendAndDeleteMessage(message, embed);
    }

    createReply(message, question)
    {
        const prediction = predict();
        const embed = {
            "description": "**" + message.author.username + " asked**: " + question + "\n**Answer**: " + prediction,
            "color": 3447003,
            "footer": {
                "text": message.author.username + " ran this command"
            },
            "author": {
            "name": "8Ball",
            "icon_url": message.author.avatarURL
            }
        };

        return embed;
    }

    sendAndDeleteMessage(message, embed)
    {
        message.embed(embed);
        message.delete();
    }
}