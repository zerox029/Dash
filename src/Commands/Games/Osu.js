const Commando = require("discord.js-commando"),
      rp = require('request-promise');

module.exports = class ProfileCommand extends Commando.Command
{
    constructor(client)
    {
        super(client, {
            name: 'osu',
            group: 'games',
            memberName: "osu",
            description: "Retrieves various info from Osu!\n",
            args: [
                {
                    key: 'type',
                    prompt: 'What kind of info are you looking for?\n',
                    type: 'string',
                },
                {
                    key: 'specifier',
                    prompt: 'Depends on what info you are looking for?\n',
                    type: 'string'
                },
                {
                    key: 'gamemode',
                    prompt: 'What gamemode are you looking for? 0: Standard | 1: Taiko | 2: CtB | 3: Mania\n',
                    type: 'integer',
                }
            ]
        });
    }

    //TODO: CHANGE SPECIFER PROMPT ON PROMPTING

    async run(message, args)
    {
        switch(args.type)
        {
            case "profile":
                this.args[1].prompt = "Who do you wish to stalk?\n";

                var url = "https://osu.ppy.sh/api/get_user?k=" + process.env.OSU_API_KEY + "&u=" + args.specifier;
                
                var profileData = await rp(url, function(error, response, body) 
                {
                    return body;
                });

                var profileReply = await this.createProfileReply(profileData);
                message.channel.send(profileReply);

                break;
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
