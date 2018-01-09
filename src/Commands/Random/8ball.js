const Commando = require("discord.js-commando");
const Replies = 

module.exports = class EightBallCommand extends Commando.Command
{
    constructor(client)
    {
        super(client, {
            name: "8ball",
            aliases: ['eight', 'ball'],
            group: 'random',
            memberName: "8ball",
            description: "Decides your fate",
            examples: ["-8ball Will I become rich soon?"],
            args: [
                {
                    key: 'question',
                    prompt: 'What question would you like answered?\n',
                    type: 'string',
                    default: ''
                },
            ]
        });
    }

    async run(message, args)
    {
        //If a question has been asked, answer it
        if(args.question != "")
        {
            var roll = Math.floor(Math.random() * answers.length);
            message.reply(" **asked**: " + args.question + "\n **Answer**: " + answers[roll]);
        }
        //Otherwise, require a question
        else
        {
            message.reply(" You have not asked any question");
        }

        //Delete the question message
        message.delete();
    }
}