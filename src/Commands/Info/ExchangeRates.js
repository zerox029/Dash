const Commando = require("discord.js-commando"),
      request = require("request-promise");

module.exports = class OxrCommand extends Commando.Command
{
    constructor(client)
    {
        super(client, {
            name: "oxr",
            aliases: ["rate", "convert"],
            group: 'info',
            memberName: "oxr",
            description: "Converts currency",
            args: [
                {
                    key: "from",
                    prompt: "What currency do you wish to start from?\n",
                    type: "string",
                },
                {
                    key: "to",
                    prompt: "What currency do you wish to convert to?\n",
                    type: "string",
                },
                {
                    key: "amount",
                    prompt: "How much money do you wish to convert?\n",
                    type: "integer",
                }
            ]
        });
    }

    ///TODO: Clean this up by separating into functions
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
                return oxr;
            });

            var args = {
                amount: amount,
                from: capsFrom,
                to: capsTo
            }

            var embed = this.createEmbed(oxr, args, message);

            message.embed(embed);
        }
        catch(err)
        {
            ///TODO: Change this, it's ugly
            if(err.statusCode == 422)
            {
                message.reply("The starting currency is invalid");
            }
            else
            {
                message.reply(err);
            }
        }
    }

    createEmbed(oxr, args, message)
    {
        oxr = JSON.parse(oxr);

        if(oxr.rates[args.to] == undefined) throw "The ending currency is invalid";

        var rate = oxr.rates[args.to];
        var converted = args.amount * rate;

        const embed = {
            "description": "**" + args.amount + args.from + "** equivalates to **" + converted + args.to + "**\nThe current exchange rate is of **" + rate + "**",
            "color": 3447003,
            "footer": {
                "text": message.author.username + " ran this command"
            },
            "author": {
            "name": "Exchange rates",
            "icon_url": message.author.avatarURL
            }
        };

        return embed;
    }
}