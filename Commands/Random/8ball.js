const Commando = require("discord.js-commando");

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
        //The list of possible answers
        var answers = [
            "It is certain",
            "Without a doubt",
            "Most likely",
            "Outlook good",
            "Yes",
            "Signs point to yes",
            "It is decidedly so",
            "Yes definitely",
            "You may rely on it",
            "As I see it, yes",
            "Reply hazy try again",
            "Ask again later",
            "Better not tell you now",
            "Cannot predict now",
            "Concentrate and ask again",
            "Don't count on it",
            "My reply is no",
            "My sources say no",
            "Outlook not so good",
            "Very doubtful"
        ]

        //If a question has been asked, answer it
        if(args != "")
        {
            var roll = Math.floor(Math.random() * answers.length);
            message.reply(" **asked**: " + args + "\n **Answer**: " + answers[roll]);
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