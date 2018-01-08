const Commando = require("discord.js-commando");

const bot = new Commando.Client();

bot.registry.registerGroup('core', 'Core');
bot.registry.registerGroup('random', 'Random');
bot.registry.registerDefaults();
bot.registry.registerCommandsIn(__dirname +  "/commands");

//TODO: Link to const.json
bot.login('##');