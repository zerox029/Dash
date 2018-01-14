const Commando = require("discord.js-commando"),
      Discord  = require("discord.js"),
      rp       = require('request-promise');

const OSU_API_KEY = process.env;

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
                    prompt: 'Who do you wish to stalk?\n',
                    type: 'string'
                },
                {
                    key: 'gamemode',
                    prompt: 'What gamemode are you looking for?\n `Standard | Taiko | CtB | Mania`\n',
                    type: 'string',
                }
            ]
        });
    }

    async run(message, {type, specifier, gamemode})
    {
        switch(type)
        {
            case "profile":
                var gamemodeInt = this.getGamemodeInteger(gamemode)

                if(gamemodeInt != null)
                {
                    var url = "https://osu.ppy.sh/api/get_user?k=" + OSU_API_KEY + "&u=" + specifier + "&m=" + gamemodeInt;

                    var profileData = await rp(url, function(error, response, body) 
                    {
                        return body;
                    });
    
                    var profileReply = await this.createProfileReply(profileData, message);
                    message.channel.send({embed: profileReply});
                }
                else
                {
                    message.reply("Invalid  gamemode! >_<\n I support `standard, mania, taiko and catch the beat`");
                }

                break;

            default:
                message.reply("Invalid query type! >_<\n I only support `profile`");
                break;
        }
    }

    //Returns the integer corresponing to the specified gamemode
    //Returns null if the specified gamemode is invalid
    getGamemodeInteger(gamemode)
    {
        switch(gamemode.toLowerCase())
        {
            case "standard":
                return 0;
            case "std":
                return 0;
            case "taiko":
                return 1;
            case "ctb":
                return 2;
            case "catch the beat":
                return 2;
            case "mania":
                return 3;
            case "0":
                return 0;
            case "1":
                return 0;
            case "2":
                return 2;
            case "3":
                return 3;
            default:
                return null;
        }
    }

    createProfileReply(profileData, message)
    {
        var profileData = JSON.parse(profileData);
        profileData = profileData[0];

        var reply = "Stats for " + profileData.username + ":  http://osu.ppy.sh/u/" + profileData.user_id + "\n";
        reply += "Score:   " + profileData.ranked_score + "(#" + profileData.pp_rank + ")\n";
        reply += "Plays:   " + profileData.playcount + "(lvl" + profileData.level + ")\n";
        reply += "Accuracy:   " + profileData.accuracy + "%"; 
        
        const profileUrl = "http://osu.ppy.sh/u/" + profileData.user_id;
        const thumbnailUrl = "https://a.ppy.sh/" + profileData.user_id;

        const roundedUserLevel = Math.floor(profileData.level);
        const roundedPP = Math.round(profileData.pp_raw);
        const roundedAcc = Math.round(profileData.accuracy * 100) / 100;

        const rankedScoreText = "Score:    " + profileData.ranked_score;
        const lvlText = " (lvl" + roundedUserLevel + ")";
        const ppText = "Performance Points:    " + roundedPP;
        const rankText = " (#" + profileData.pp_rank + ")";
        const accText = "Accuracy:    " + roundedAcc + "%";

        const completeScoreText = rankedScoreText + lvlText + "\n" + ppText + rankText + "\n" + accText;

        const embed = {
            "color": 1566961,
            "footer": {
              "text": message.author.username + " ran this command"
            },
            "thumbnail": {
              "url": thumbnailUrl
            },
            "author": {
              "name": "Osu",
              "url": profileUrl,
              "icon_url": "https://orig00.deviantart.net/bff0/f/2015/202/8/7/minimalistic_patterned___osu__logo_remake_by_glitchypsix-d92ap0c.png"
            },
            "fields": [
              {
                "name": "Stats for " + profileData.username + ": " + profileUrl,
                "value": completeScoreText
              }
            ]
          };

        return embed;
    }
}
