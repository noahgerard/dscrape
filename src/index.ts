const { Client } = require('discord.js-selfbot-v13');
import dotenv from 'dotenv';
dotenv.config();

const client = new Client();

client.on('ready', () => {

});

client.login(process.env.TOKEN);