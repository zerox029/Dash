const Commando = require("discord.js-commando"),
      rp = require('request-promise');

module.exports = class ProfileCommand extends Commando.Command
{
    constructor(client)
    {
        super(client, {
            name: "osu",
            group: 'games',
            memberName: "osu",
            description: "Retrieves various info from Osu!\n",
            args: [
                {
                    key: 'type',
                    prompt: 'What kinf of info are you looking for?\n',
                    type: 'string',
                    default: ''
                },
                {
                    key: 'specifier',
                    prompt: 'Depends on what info you are looking for?\n',
                    type: 'string'
                }
            ]
        });
    }
    
    async run(message, args)
    {
        switch(args.type)
        {
            case "profile":
                var url = "https://osu.ppy.sh/api/get_user?k=" + process.env.OSU_API_KEY + "&u=" + args.specifier;
                var profileData = await rp(url, function(error, response, body) {
                    return body;
                });

                var profileReply = await this.createProfileReply(profileData);
                message.channel.send(profileReply);

                break;
            
            case "beatmap":
                //TODO: retrieve beatmap info

        }
    }

    createProfileReply(profileData)
    {
        var profileData = JSON.parse(profileData);
        profileData = profileData[0];

        var reply = "Stats for " + profileData.username + ":  http://osu.ppy.sh/u/" + profileData.user_id + "\n";
        reply += "Score:   " + profileData.ranked_score + "(#" + profileData.pp_rank + ")\n";
        reply += "Plays:   " + profileData.playcount + "(lvl" + profileData.level + ")\n";
        reply += "Accuracy:   " + profileData.accuracy + "%"; 

        return reply;
    }
}
