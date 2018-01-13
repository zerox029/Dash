const Commando = require("discord.js-commando"),
      request = require("request-promise");

module.exports = class OxrCommand extends Commando.Command
{
    constructor(client)
    {
        super(client, {
            name: "oxr",
            aliases: ["rate", "convert"],
            group: 'util',
            memberName: "oxr",
            description: "Converts currency",
            args: [
                {
                    key: "amount",
                    prompt: "How much money do you wish to convert?\n",
                    type: "integer",
                    min: 0
                },
                {
                    key: "from",
                    prompt: "What currency do you wish to start from?\n",
                    type: "string",
                },
                {
                    key: "to",
                    prompt: "What currency do you wish to convert to?\n",
                    type: "string",
                }
            ]
        });
    }

    async run(message, {amount, from, to})
    {
        try
        {
            var capsFrom = from.toUpperCase();
            var capsTo = to.toUpperCase();
    
            var url = "https://api.fixer.io/latest?base=" + capsFrom + "&symbols=" + capsTo;
            var oxr;
    
            var oxr = await request(url, function(error, response, body) 
            {
                return body;
            });

            oxr = JSON.parse(oxr);
            var rate = oxr.rates[capsTo];
            var converted = amount * rate;

            message.say(amount + capsFrom + " equivalates to " + converted + capsTo);
        }
        catch(err)
        {
            message.reply("Sorry! I could not convert");
            console.log(err);
        }
    }
}