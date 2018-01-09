const Commando = require("discord.js-commando"),
      request = require('request');

module.exports = class ProfileCommand extends Commando.Command
{
    constructor(client)
    {
        super(client, {
            name: "osuprofile",
            aliases: ['oprofile'],
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
                    type: 'integer',
                    default: '0'
                }
            ]
        });
    }

    async run(message, args)
    {
        var APIRequest = "https://osu.ppy.sh/api/get_user?k=" + process.env.OSU_API_KEY + "&u=" + args.username;
        var profileData;

        request(APIRequest, function(error, response, body) {
            profileData = JSON.parse(body);
            console.log(profileData);

            //Create the reply
            var reply = profileData[0].username + " is currently ranked " + profileData[0].pp_rank + " globally";
            message.reply(reply);
        });
    }
}