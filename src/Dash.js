const Commando = require('discord.js-commando'),
	  Discord = require('discord.js'),
	  Path = require('path'),
		sqlite = require('sqlite');



class Dash {
	constructor (token) {
		this.bootTime = new Date();
		this.token = token;
		this.client = new Commando.Client({
			'commandPrefix': '--',
			'owner': '230702257480400896',
			'selfbot': false,
			'unknownCommandResponse': false
		});
		this.isReady = false;
	}

	onReady () {
		return () => {
			console.log(`Client ready; logged in as ${this.client.user.username}#${this.client.user.discriminator} (${this.client.user.id})`);

			this.client.user.setActivity("with Ruby", {
				type: "PLAYING"
			});
			this.isReady = true;
		};
	}

	onCommandPrefixChange () {
		return (guild, prefix) => {
			// eslint-disable-next-line no-console
			console.log(oneLine ` 
			Prefix ${prefix === '' ? 'removed' : `changed to ${prefix || 'the default'}`}
			${guild ? `in guild ${guild.name} (${guild.id})` : 'globally'}.
		`);
		};
	}

	onDisconnect () {
		return () => {
			console.warn('Disconnected!');
		};
	}

	onReconnect () {
		return () => {
			console.warn('Reconnecting...');
		};
	}

	onCmdErr () {
		return (cmd, err) => {
			if (err instanceof Commando.FriendlyError) {
				return;
			}
			console.error(`Error in command ${cmd.groupID}:${cmd.memberName}`, err);
		};
	}

	onCmdBlock () {
		return (msg, reason) => {
			// eslint-disable-next-line no-console
			console.log(oneLine `
		Command ${msg.command ? `${msg.command.groupID}:${msg.command.memberName}` : ''}
		blocked; ${reason}
	`);
		};
	}

	onCmdStatusChange () {
		return (guild, command, enabled) => {
			// eslint-disable-next-line no-console
			console.log(oneLine `
            Command ${command.groupID}:${command.memberName}
            ${enabled ? 'enabled' : 'disabled'}
            ${guild ? `in guild ${guild.name} (${guild.id})` : 'globally'}.
        `);
		};
	}

	onGroupStatusChange () {
		return (guild, group, enabled) => {
			// eslint-disable-next-line no-console
			console.log(oneLine `
            Group ${group.id}
            ${enabled ? 'enabled' : 'disabled'}
            ${guild ? `in guild ${guild.name} (${guild.id})` : 'globally'}.
        `);
		};
	}

	onMessage () {
		return (msg) => {
			if (msg.guild) {
				if (!msg.guild.available) {
					return; // eslint-disable-line no-useless-return
				}	
				if(msg.content.toLowerCase().includes("rekt") && !msg.author.bot)
						msg.channel.send("Yeah, get rekt son!");
				if(msg.content.includes("69") && !msg.author.bot)
					if(msg.content.toLowerCase().includes("434437407023169547") && !msg.author.bot)
						msg.channel.send("nerd");
					else
						msg.channel.send("nice.");
			}
		};
	}

	init () {
		this.client
			.on('ready', this.onReady())
			.on('commandPrefixChange', this.onCommandPrefixChange())
			.on('error', console.error)
			.on('warn', console.warn)
			.on('debug', console.log)
			.on('disconnect', this.onDisconnect())
			.on('reconnecting', this.onReconnect())
			.on('commandError', this.onCmdErr())
			.on('commandBlocked', this.onCmdBlock())
			.on('commandStatusChange', this.onCmdStatusChange())
			.on('groupStatusChange', this.onGroupStatusChange())
			.on('message', this.onMessage());

		this.client.setProvider(
			sqlite.open(Path.join(__dirname, 'settings.sqlite3')).then(db => new Commando.SQLiteProvider(db))
		).catch(console.error);

		this.client.registry
			.registerGroups([
				['fun', 'Fun and games to play with the bot'],
				['info', 'Information on various thing'],
				['music', "Listen to some good ol' music"],
				['games', 'Play games or see your stats!'],
				['nsfw', 'More kinky commands | 18+'],
				['time', 'Now you can be the server\'s time keeper'],
				['moderation', 'Moderate your server'],
				['quizzes', 'Quizzes on various topics']
			])
			.registerDefaultGroups()
			.registerDefaultTypes()
			.registerDefaultCommands({
				'help': true,
				'prefix': true,
				'ping': true,
				'eval_': true,
				'commandState': true
			})
			.registerCommandsIn(Path.join(__dirname, '/Commands'));

		return this.client.login(this.token);
	}

	deinit () {
		this.isReady = false;

		return this.client.destroy();
	}
}

module.exports = Dash;