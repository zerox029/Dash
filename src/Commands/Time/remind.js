const Commando = require("discord.js-commando");

module.exports = class Remind extends Commando.Command
{
    constructor(client)
    {
        super(client, {
            name: "remind",
            aliases: ['remind me'],
            group: 'time',
            memberName: "remind",
            description: "I can remind you to do something later",
            examples: ["remind 60 go cook dinner"],
            args: [
                {
                    key: 'time',
                    prompt: 'In how long do you want me to set the reminder to (in minutes)?\n',
                    type: 'float'
                },
                {
                    key: 'action',
                    prompt: 'What do you want me to remind you to do?\n',
                    type: 'string'
                }
            ]
        });
    }

    run(message, {time, action})
    {
        try
        {
            var timeInMilli = this.convertTimeToMilliseconds(time);
            setTimeout(function(){
                message.reply("You have asked me to remind you the following: " + action);
            }, timeInMilli);

            message.say("Understood! I will remind you in " + time + " minutes");
        }
        catch(err)
        {
            message.reply("Sorry! I could not create the reminder...");
            console.log(err);
        }
    }
    
    convertTimeToMilliseconds(time)
    {
        return(time*60000);
    }
}