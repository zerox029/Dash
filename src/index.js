const Commando = require("discord.js-commando");
const sqlite = require("sqlite");
const path = require('path');
require('dotenv').config();

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

bot.login(process.env.DISCORD_TOKEN);