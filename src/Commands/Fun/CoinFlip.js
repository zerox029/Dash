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

    run(message, {amount})
    {
        for(var i = 0; i < amount; i++)
        {
            var response = this.createResponse(amount);
            message.say(response);
        }
    }

    createResponse(amount)
    {
        var possibleAnswers = [
            "Heads",
            "Tails"
        ]

        var roll = Math.floor(Math.random() * possibleAnswers.length);

        if(amount == 1)
        {
            return "The coin landed on " + possibleAnswers[roll];
        }
        else
        {
            var coinNumber = i + 1;
            return "The coin number " + coinNumber + " landed on " + possibleAnswers[roll];
        }
    }
}