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

    async run(message, args)
    {
        try
        {
            const booruData = await booru.search('danbooru', args.tags.split(' '), {
                'limit': 1,
                'random': true
            }).then(booru.commonfy);

            if(booruData)
            {
                return message.say("Here is what I found for " + args.tags + `: ${booruData[0].common.file_url}`);
            }

            return message.reply('Sorry! I could not find any image tagged with ' + args.tags);
        }
        catch(err)
        {
            return message.reply('Sorry! I could not find any image tagged with ' + args.tags);
        }
    }
}