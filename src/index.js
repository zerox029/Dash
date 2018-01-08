const Commando = require("discord.js-commando");
const sqlite = require("sqlite");
const path = require('path');

const bot = new Commando.Client({unknownCommandResponse: false});

bot.setProvider(
    sqlite.open(path.join(__dirname, 'settings.sqlite3')).then(db => new Commando.SQLiteProvider(db))
).catch(console.error);

bot.registry
    .registerGroups([
        ['random', 'Random'],
        ['fun', 'Fun'],
        ['mod', 'Moderation']
    ])
    .registerDefaults()
    .registerCommandsIn(__dirname +  "/Commands");

//TODO: Link to const.json
bot.login('Mzk5NzA1ODAxNzE3MTg2NTcx.DTQ-jA.uZmTRGMqqxtq0tdgaE6ivXJpDJQ');
console.log(bot.commandPrefix);