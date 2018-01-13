const Commando = require("discord.js-commando"),
      math = require("mathjs");

module.exports = class DiceRollCommand extends Commando.Command
{
    constructor(client)
    {
        super(client, {
            name: "math",
            aliases: ["calc", "calculate"],
            group: 'util',
            memberName: "math",
            description: "Evaluates a mathematical expression",
            args: [
                {
                    key: "expression",
                    prompt: "What do you want me to calculate?\n",
                    type: "string"
                }
            ]
        });
    }

    async run(message, args)
    {
        try
        {
            var answer = math.eval(args.expression);
            message.say("I evaluate ` " + args.expression + " ` to equal ` " + answer + " `");
        }
        catch(err)
        {
            message.reply("Sorry! I could not evaluate the given expression");
            console.log(err);
        }
    }
}