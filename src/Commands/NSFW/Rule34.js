const Commando = require("discord.js-commando"),
      request = require("request");

class Rule34Command extends Commando.Command
{
    constructor(client)
    {
        super(client, {
            name: "rule34",
            aliases: ['r34'],
            group: 'nsfw',
            memberName: "rule34",
            description: "Sends an NSFW pic from r34",
            args: [
                {
                    key: 'tags',
                    prompt: 'What tags do you want to search for?\n',
                    type: 'string'
                }
            ]
        });
    }

    run(message, args)
    {
        var queryUrl = this.createUrl(args.tags);
        var posts = this.retrieveQueryResponse(queryUrl);
        console.log(posts);
        console.log("____________" + queryUrl);
    }

    createUrl(tags)
    {
        var baseUrl = "https://rule34.xxx/index.php?page=dapi&s=post&q=index";
        var query = "&tags=" + tags;

        var completeUrl = baseUrl + query;

        return completeUrl;
    }

    retrieveQueryResponse(url)
    {
        var posts = request(url, function(error, response, body) 
        {
            return body;
        });

        return posts;
    }
}