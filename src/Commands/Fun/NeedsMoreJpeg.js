const Commando = require("discord.js-commando");

module.exports = class NeedsMoreJpeg extends Commando.Command
{
    constructor(client)
    {
        super(client, {
            name: "jpeg",
            aliases: ['jpg', 'needsmorejpeg', 'needsmorejpeg', 'jpgify', 'jpegify', 'j'],
            group: 'fun',
            memberName: "jpegify",
            description: "The solution to all your jpeg making problems... - **DOESN'T WORK**"
        });
    }

    async run(message, args)
    {
        var Attachments = (message.attachments).array();
        message.reply('http://morejpeg.com/Image/JPEG/b14252cf-9cf4-e711-80e6-bb81c215c2dd');
    }
}