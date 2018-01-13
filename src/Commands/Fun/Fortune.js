const Commando = require("discord.js-commando"),
      cookie   = require("fortune-cookie");

module.exports = class DiceRollCommand extends Commando.Command
{
    constructor(client)
    {
        super(client, {
            name: "fortune",
            aliases: ['fortunecookie'],
            group: 'fun',
            memberName: "fortune",
            description: "A good ol' fortune teller"
        });
    }

    async run(message, args)
    {
        var count = Object.keys(cookie).length;
        var roll = Math.floor(Math.random() * count);

        message.say(cookie[roll]);
    }
}