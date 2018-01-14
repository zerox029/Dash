const Commando = require("discord.js-commando");

module.exports = class DiceRollCommand extends Commando.Command
{
    constructor(client)
    {
        super(client, {
            name: "roll",
            aliases: ['dice', 'diceroll'],
            group: 'fun',
            memberName: "roll",
            description: "Rolls a die"
        });
    }

    run(message, args)
    {
        var roll = Math.floor(Math.random() * 6) + 1;
        message.say("You rolled a " + roll);
    }
}