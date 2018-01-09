import { url } from "inspector";

const Commando = require("discord.js-commando"),
      request = require('request');

module.exports = class ProfileCommand extends Commando.Command
{
    constructor(client)
    {
        super(client, {
            name: "osuprofile",
            aliases: ['oprofile'],
            group: 'games',
            memberName: "profile",
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
        var APIRequest = "https://osu.ppy.sh/api/";

        //If the user is requesting profile data
        if(args.type == "profile")
        {
        }

        else if(args.type == "beatmap")
        {
            //TODO: retrieve beatmap info
        }

        switch(args.type)
        {
            case "profile":
                var url = APIRequest + "get_user?k=" + process.env.OSU_API_KEY + "&u=" + args.specifier;

                request(APIRequest + urlAppend, function(error, response, body) {
                    profileData = JSON.parse(body);
                    profileData = profileData[0];
        
                    console.log(url);

                    //Create the reply
                    var reply = "Stats for " + profileData.username + ":  http://osu.ppy.sh/u/" + profileData.user_id + "\n";
                    reply += "Score:   " + profileData.ranked_score + "(#" + profileData.pp_rank + ")\n";
                    reply += "Plays:   " + profileData.playcount + "(lvl" + profileData.level + ")\n";
                    reply += "Accuracy:   " + profileData.accuracy + "%"; 
                    
                    message.channel.send(reply);
                });

                break;
            
            case "beatmap":
                //TODO: retrieve beatmap info

        }
    }
}
