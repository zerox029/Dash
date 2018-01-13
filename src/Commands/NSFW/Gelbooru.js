const Commando = require("discord.js-commando"),
      booru = require("booru");

module.exports = class GelbooruCommand extends Commando.Command
{
    constructor(client)
    {
        super(client, {
            name: "gelbooru",
            aliases: ['gb', 'gbooru'],
            group: 'nsfw',
            memberName: "gelbooru",
            description: "Sends a NSFW pic from gelbooru",
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
            const booruData = await booru.search('gelbooru', args.tags.split(' '), {
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