const Commando = require("discord.js-commando"),
      booru = require("booru");

module.exports = class Rule34Command extends Commando.Command
{
    constructor(client)
    {
        super(client, {
            name: "rule34",
            aliases: ['r34'],
            group: 'nsfw',
            memberName: "rule34",
            description: "Sends an NSFW pic from r34",
            args: [
                {
                    key: 'tags',
                    prompt: 'What tags do you want to search for?\n',
                    type: 'string'
                }
            ]
        });
    }

    async run(message, args)
    {
        try
        {
            const booruData = await booru.search('r34', args.tags.split(' '), {
                'limit': 1,
                'random': true
            }).then(booru.commonfy);

            if(booruData)
            {
                return message.say("Here is what I found for " + args.tags + `: ${booruData[0].common.file_url}`);
            }
        }
        catch(err)
        {

        }
    }
}