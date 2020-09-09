const Commando = require("discord.js-commando"),
      Discord  = require("discord.js"),
      rp       = require('request-promise'),
      fs       = require('fs'),
      text2png = require('text2png'),
      jishoApi = require('unofficial-jisho-api'),
      jisho    = new jishoApi();

module.exports = class ProfileCommand extends Commando.Command
{
    constructor(client)
    {
        super(client, {
            name: 'kanji',
            group: 'quizzes',
            memberName: "kanji",
            description: "Quizzes you on various kanji compounds",
            args: [
                {
                    key: 'level',
                    prompt: 'What JLPT level are you looking for?',
                    type: 'string',
                }
            ]
        });

        var isRunning = false;
    }

    async run(message, {level})
    {
        if(this.quizRound(message));
    }

    quizRound(message, previousScore={})
    {
        this.isRunning = true;
        const filter = m => true;
        const collector = message.channel.createMessageCollector(filter, {time: 20000});

        var correct = false;
        var score = previousScore;
        var kanjiTxt = "";
        var answerTxt = "";
        var meaningTxt = "";

        fs.readFile(this.getKanjiList(), (err, data) => {
            if(err) throw err;
            let jsonData = JSON.parse(data);
            let kanji = jsonData.cards;
            let length = kanji.length;

            var randomValue = Math.floor(Math.random() * length);
            kanjiTxt = kanji[randomValue].question;
            answerTxt = kanji[randomValue].answer;
            meaningTxt = kanji[randomValue].meaning;

            fs.writeFileSync(`kanjiPics/${kanjiTxt}.png`, text2png(kanjiTxt, {
                color: 'black', 
                backgroundColor: 'white', 
                padding: 10,
                font: '50px Noto Sans CJK',
                output: 'buffer'}), () => {
                    console.log("error");
                })

            message.channel.send("What is the reading of this kanji compound?", { file: `kanjiPics/${kanjiTxt}.png` });
        });

        collector.on('collect', message => {
            if(message.content.toLowerCase() === "quit" && this.isRunning)
            {
                message.channel.send(this.createEndGameEmbed(score));
                correct = true;
                this.isRunning = false;
                collector.stop();
            }
            if(answerTxt.includes(message.content))
            {
                score = this.addScore(score, message.author);
                correct = true;
                message.channel.send(this.createCorrectEmbed(score, message.author, answerTxt, meaningTxt));
                collector.stop();
                setTimeout(() => {}, 2000);
                this.quizRound(message, score);
            }
        });
        collector.on('end', collected => {
            if(!correct)
            {
                message.channel.send(this.createWrongEmbed(score, answerTxt, meaningTxt));
                collector.stop();
                this.quizRound(message, score);
            }
        })
    }

    getKanjiList()
    {
        switch(this.level)
        {
            case "n5":
                return 'resources/kn5.json';
            case "n4":
                return 'resources/kn4.json';
            case "n3":
                return 'resources/kn3.json';
            case "n2":
                return 'resources/kn2.json';
            case "n1":
                return 'resources/kn1.json';
        }
    }

    createCorrectEmbed(score, user, answer, meaning)
    {
        const embed = new Discord.RichEmbed()
        .setTitle("Kanji quiz")
        .setColor('#00ff06')
        .setDescription(`${user} got it first`)
        .addField("Answers", `${this.getAnswersText(answer)}`, true)
        .addField("Leaderboard", `${this.getLeaderboardText(score)}`, true)
        .addField("Meaning", meaning);

        return embed;
    }

    createWrongEmbed(score, answer, meaning)
    {
        const embed = new Discord.RichEmbed()
        .setTitle("Kanji quiz")
        .setColor('#de1f1f')
        .setDescription("Time's up!")
        .addField("Answers", `${this.getAnswersText(answer)}`, true)
        .addField("Leaderboard", `${this.getLeaderboardText(score)}`, true)
        .addField("Meaning", meaning);

        return embed;
    }

    createEndGameEmbed(score)
    {
        const embed = new Discord.RichEmbed()
        .setTitle("Kanji quiz")
        .setColor('#c214f7')
        .setDescription("Thank you for playing!")
        .addField("Leaderboard", `${this.getLeaderboardText(score)}`);

        return embed;
    }

    getAnswersText(answer)
    {
        let string = "";
        for(var i = 0; i < answer.length; i++)
        {
            string = string.concat(answer[i], "\n");
        }

        return string.substring(0, string.length - 1);
    }

    getLeaderboardText(score)
    {
        const keys = Object.keys(score);
        var string = "";

        for(var i = 0; i < keys.length; i++)
        {
            string = string.concat(keys[i], "(", score[keys[i]], ")\n")
        }

        return string.substring(0, string.length - 1);
    }

    addScore(currentScore, user)
    {
        if(user in currentScore)
        {
            currentScore[user] = currentScore[user] + 1;
        }
        else
        {
            currentScore[user] = 1;
        }

        return currentScore;
    }
}
