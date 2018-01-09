const Commando = require("discord.js-commando");

module.exports = class ProfileCommand extends Commando.Command
{
    constructor(client)
    {
        super(client, {
            name: "profile",
            group: 'osu',
            memberName: "profile",
            description: "Displays stats from a user profile",
            args: [
                {
                    key: 'username',
                    prompt: 'Who do you want to stalk?\n',
                    type: 'string',
                    default: ''
                },
                {
                    key: 'gamemode',
                    prompt: 'Any gamemode preference?\n',
                    type: 'int',
                    default: '0'
                }
            ]
        });
    }

    async run(message, args)
    {
        var baseAPIURL = "https://osu.ppy.sh/api/";

        if(args.catergoy == "profile")
        {
            var APIRequest = "get_user?k=" + process.env.OSU_API_KEY + "&u=" + args.username;
            
        }
    }
}