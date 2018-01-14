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
            description: "Sends a NSFW pic from r34",
            args: [
                {
                    key: 'tags',
                    prompt: 'What tags do you want to search for?\n',
                    type: 'string'
                }
            ]
        });
    }

    async run(message, {tags})
    {
        try
        {
            const booruData = await booru.search('r34', tags.split(' '), {
                'limit': 1,
                'random': true
            }).then(booru.commonfy);

            var response = this.createResponse(tags, booruData);
            return message.say(response);
        }
        catch(err)
        {
            return message.reply('Sorry! I could not find any image tagged with ' + tags);
        }
    }

    createResponse(tags, booruData)
    {
        if(booruData)
        {
            return "Here is what I found for " + tags + `: ${booruData[0].common.file_url}`;
        }

        return 'Sorry! I could not find any image tagged with ' + tags;
    }
}