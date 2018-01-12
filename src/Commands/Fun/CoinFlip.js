const Commando = require("discord.js-commando");

module.exports = class EightBallCommand extends Commando.Command
{
    constructor(client)
    {
        super(client, {
            name: "coinflip",
            aliases: ['coin', 'flip'],
            group: 'fun',
            memberName: "coinflip",
            description: "Heads or Tails, that is the question",
            examples: ["coinflip {Coin Amount}", "coinflip 5"],
            args: [
                {
                    key: 'amount',
                    prompt: 'How many coins do you want to flip?\n',
                    min: 1,
                    type: 'integer',
                    default: '1'
                }
            ]
        });
    }

    async run(message, args)
    {
        var answers = [
            "Heads",
            "Tails"
        ]

        for(var i = 0; i < args.amount; i++)
        {
            //Either 0 or 1
            var roll = Math.floor(Math.random() * answers.length);

            if(args.amount == 1)
            {
                message.channel.send("The coin landed on " + answers[roll]);
            }
            else
            {
                var coinNumber = i + 1;
                message.channel.send("The coin number " + coinNumber + " landed on " + answers[roll]);
            }
        }
    }
}