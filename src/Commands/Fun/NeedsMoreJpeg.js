const Commando = require("discord.js-commando"),
      Jimp = require("jimp"),
      path = require("path"),
      isImageUrl = require("is-image-url");

module.exports = class NeedsMoreJpeg extends Commando.Command
{
    constructor(client)
    {
        super(client, {
            name: "jpeg",
            aliases: ['jpg', 'needsmorejpeg', 'needsmorejpeg', 'jpgify', 'jpegify', 'j'],
            group: 'fun',
            memberName: "jpegify",
            description: "The solution to all your jpeg making problems...",
            args: [
                {
                    key: "link",
                    prompt: "A link to an image, optional",
                    type: "string",
                    default: ''
                }
            ]
        });
    }

    async run(message, {link})
    {
        try
        {
            var attachments = (message.attachments).array();
            var imgLink = this.getImageLink(attachments, link)
            var newImagePath = this.getNewFilePath();

            await Jimp.read(imgLink).then(function (img) 
            {
                img.quality(1)
                   .write(newImagePath);
            }).catch(function (err) 
            {
                if(err.code == 'ENOENT')
                    err = "You didn't provide me with a valid image";

                message.reply(err);
            });

            message.say("I am done!", {
                file: newImagePath
            });
        }
        catch(err)
        {
            message.reply(err);
        }
    }

    makeID()
    {
        var text = "";
        var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

        for(var i = 0; i < 8; i++)
        {
            text += possible.charAt(Math.floor(Math.random() * possible.length));
        }

        return text;
    }

    getImageLink(attachments, link)
    {
        if(attachments === undefined || attachments.length == 0)
        {
            if(link == '')
            {
                throw "You haven't given me any image to jpegify";
            }
            else
            {
                if(!isImageUrl(link))
                {
                    throw "The file you sent me is invalid";
                }
                else
                {
                    return link;
                }
            }
        }
        else
        {
            if(!isImageUrl(attachments[0].url))
            {
                throw "The file you sent me is invalid";
            }
            else
            {
                return attachments[0].url;
            }
        }
    }

    getNewFilePath()
    {
        var newFileName = this.makeID();
        var masterFolderPath = path.join(__dirname, '..', '..', '..', 'Data', 'MoreJpeg');
        var newImagePath = masterFolderPath + "/"+ newFileName + ".jpeg";

        return newImagePath;
    }
}