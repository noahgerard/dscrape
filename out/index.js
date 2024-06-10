"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const { Client } = require('discord.js-selfbot-v13');
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const client = new Client();
client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
});
client.login(process.env.TOKEN);
