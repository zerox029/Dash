/*
 *   This file is part of Ribbon
 *   Copyright (C) 2017-2018 Favna
 *
 *   This program is free software: you can redistribute it and/or modify
 *   it under the terms of the GNU General Public License as published by
 *   the Free Software Foundation, version 3 of the License
 *
 *   This program is distributed in the hope that it will be useful,
 *   but WITHOUT ANY WARRANTY; without even the implied warranty of
 *   MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *   GNU General Public License for more details.
 *
 *   You should have received a copy of the GNU General Public License
 *   along with this program.  If not, see <http://www.gnu.org/licenses/>.
 *
 *   Additional Terms 7.b and 7.c of GPLv3 apply to this file:
 *       * Requiring preservation of specified reasonable legal notices or
 *         author attributions in that material or in the Appropriate Legal
 *         Notices displayed by works containing it.
 *       * Prohibiting misrepresentation of the origin of that material,
 *         or requiring that modified versions of such material be marked in
 *         reasonable ways as different from the original version.
 */

// eslint-disable-next-line no-mixed-requires
const Commando = require('discord.js-commando'),
	Discord = require('discord.js'),
	Path = require('path'),
	sqlite = require('sqlite');

class Dash {
	constructor (token) {
		this.bootTime = new Date();
		this.token = token;
		this.client = new Commando.Client({
			'commandPrefix': '-',
			'owner': '112001393140723712',
			'selfbot': false
		});
		this.isReady = false;
	}

	onReady () {
		return () => {
			console.log(`Client ready; logged in as ${this.client.user.username}#${this.client.user.discriminator} (${this.client.user.id})`);

			this.client.user.setGame("@Dash help")
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
			}
		};
	}

	onGuildMemberAdd () {
		return (member) => {
			if (this.client.provider.get(member.guild, 'memberlogs', true)) {
				const embed = new Discord.MessageEmbed(),
					memberLogs = this.client.provider.get(member.guild, 'memberlogchannel',
						member.guild.channels.exists('name', 'member-logs')
							? member.guild.channels.find('name', 'member-logs').id
							: null);

				embed.setAuthor(`${member.user.tag} (${member.id})`, member.user.displayAvatarURL({'format': 'png'}))
					.setFooter(`User joined | ${moment().format('MMMM Do YYYY [at] HH:mm:ss [UTC]Z')}`)
					.setColor('#E24141');

				if (this.client.provider.get(member.guild.id, 'defaultRole')) {
					member.addRole(this.client.provider.get(member.guild.id, 'defaultRole'));
					embed.setDescription(`Automatically assigned the role ${member.guild.roles.get(this.client.provider.get(member.guild.id, 'defaultRole')).name} to this member`);
				}

				if (memberLogs !== null && member.guild.channels.get(memberLogs).permissionsFor(this.client.user)
					.has('SEND_MESSAGES')) {
					member.guild.channels.get(memberLogs).send({embed});
				}
			}
		};
	}

	onGuildMemberRemove () {
		return (member) => {
			if (this.client.provider.get(member.guild, 'memberlogs', true)) {
				const embed = new Discord.MessageEmbed(),
					memberLogs = this.client.provider.get(member.guild, 'memberlogchannel',
						member.guild.channels.exists('name', 'member-logs')
							? member.guild.channels.find('name', 'member-logs').id
							: null);

				embed.setAuthor(`${member.user.tag} (${member.id})`, member.user.displayAvatarURL({'format': 'png'}))
					.setFooter(`User left | ${moment().format('MMMM Do YYYY [at] HH:mm:ss [UTC]Z')}`)
					.setColor('#E24141');

				if (memberLogs !== null && member.guild.channels.get(memberLogs).permissionsFor(this.client.user)
					.has('SEND_MESSAGES')) {
					member.guild.channels.get(memberLogs).send({embed});
				}
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
			.on('guildMemberAdd', this.onGuildMemberAdd())
			.on('guildMemberRemove', this.onGuildMemberRemove())
			.on('message', this.onMessage());

		this.client.setProvider(
			sqlite.open(Path.join(__dirname, 'settings.sqlite3')).then(db => new Commando.SQLiteProvider(db))
		).catch(console.error);

		this.client.registry
			.registerGroups([
				['fun', 'Fun and Games to play with the bot'],
				['moderation', 'Moderate your server'],
				['random', 'Randomizers of all sorts'],
				['osu', 'Stats directly from Osu!']
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