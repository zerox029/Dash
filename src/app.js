require('dotenv').config();
const Path = require('path'),
	Dash = require(Path.join(__dirname, 'Dash.js'));
	start = function () {
		new Dash(process.env.DISCORD_TOKEN).init();
	};

start();