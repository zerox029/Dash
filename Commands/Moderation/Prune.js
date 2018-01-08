const Commando = require("discord.js-commando");

class PruneCommand extends Commando.Command
{
    constructor(client)
    {
        super(client, {
            name: "prune",
            group: 'mod',
            memberName: "prune",
            description: "Prunes the amount of messages specified"
        });
    }

    async run(message, args)
    {
        //If the argument is a number
        if(!isNaN(args))
        {
            //If the argument is bigger than 0, remove n messages
            if(args > 0)
            {
                
                message.reply("Removed " + args);
            }
            //Otherwise complain
            else
                message.reply("Please enter a valid amount of messages to remove");
                message.remove(0);
        }
        //Otherwise complain
        else
        {
            message.reply("Please enter a valid amount of messages to remove");
            message.remove(0);
        }
    }
}

module.exports = PruneCommand;