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
            description: "Retrieves various info from the Osu! game\n",
            args: [
                {
                    key: 'type',
                    prompt: 'What kind of info are you looking for?\n I support `profile`\n',
                    type: 'string',
                },
                {
                    key: 'specifier',
                    prompt: 'Depends on what info you are looking for?\n',
                    type: 'string'
                },
                {
                    key: 'gamemode',
                    prompt: 'What gamemode are you looking for?\n `0: Standard | 1: Taiko | 2: CtB | 3: Mania`\n',
                    type: 'integer',
                    min: 0,
                    max: 3
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

                var url = "https://osu.ppy.sh/api/get_user?k=" + process.env.OSU_API_KEY + "&u=" + args.specifier + "&m=" + args.gamemode;
                
                var profileData = await rp(url, function(error, response, body) 
                {
                    return body;
                });

                var profileReply = await this.createProfileReply(profileData);
                message.channel.send(profileReply);

                break;

            // case "top scores":
            //     this.args[1].prompt = "Who do you wish to stalk?\n";

            //     var url = "https://osu.ppy.sh/api/get_user_best?k=" + process.env.OSU_API_KEY + "&u=" + args.specifier + "&m=" + args.gamemode + "&limit=10";

            //     var scoresData = await rp(url, function(error, response, body) 
            //     {
            //         return body;
            //     });

            //     var scoresReply = await this.createScoresReply(profileData);
            //     message.channel.send(scoresReply);

            //     break;

            default:
                message.reply("Invalid query type! >_<\n I only support `profile`")
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

    createScoresReply(scoresData)
    {
        var scoresData = JSON.parse(scoresData);
        var reply;

        for(var i = 0; i > scoresData.length; i++)
        {
            var scoreCount = i + 1;
            reply += scoreCount + ": " + scoresData.pp + "\n";
        }

        return reply;
    }
}
