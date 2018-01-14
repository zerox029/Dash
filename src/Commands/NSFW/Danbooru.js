const Commando = require("discord.js-commando"),
      booru = require("booru");

module.exports = class DanbooruCommand extends Commando.Command
{
    constructor(client)
    {
        super(client, {
            name: "danbooru",
            aliases: ['db', 'dbooru'],
            group: 'nsfw',
            memberName: "danbooru",
            description: "Sends a NSFW pic from danbooru",
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
            const booruData = await booru.search('danbooru', tags.split(' '), {
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