"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_selfbot_v13_1 = require("discord.js-selfbot-v13");
const dotenv_1 = __importDefault(require("dotenv"));
const fs_1 = __importDefault(require("fs"));
dotenv_1.default.config();
const client = new discord_js_selfbot_v13_1.Client();
const channelsToScrape = [
    "1245368220865794088"
];
function normalizeMessages(messages) {
    return messages.map((entry) => {
        const message = entry[1];
        return {
            id: message.id,
            createdTimestamp: message.createdTimestamp,
            content: message.content,
            embeds: message.embeds,
            attachments: message.attachments.map((attachment) => {
                return {
                    url: attachment.url,
                    filename: attachment.name
                };
            }),
        };
    });
}
client.on("ready", () => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    console.log(`Logged in as ${(_a = client === null || client === void 0 ? void 0 : client.user) === null || _a === void 0 ? void 0 : _a.tag}!`);
    const guild = yield client.guilds.fetch("1087843967573438504");
    for (let c of guild.channels.cache.entries()) {
        const channelID = c[0];
        const channel = yield guild.channels.fetch(channelID);
        if (!channel) {
            console.log(`Channel (${channelID}) not found.`);
            continue;
        }
        if (channel.parentId != "1088044992922132501") {
            continue;
        }
        if (!channel.isText()) {
            console.log(`Channel ${channel === null || channel === void 0 ? void 0 : channel.name} (${channelID}) is not a text channel.`);
            continue;
        }
        console.log(`Scraping channel ${channel === null || channel === void 0 ? void 0 : channel.name} (${channelID})...`);
        // Fetch the last 100 messages continuously until we have all messages
        let lastMessage = yield channel.messages.fetch({ limit: 100 });
        let lastMessageId = lastMessage.lastKey();
        let messages = Array.from(lastMessage);
        do {
            lastMessage = yield channel.messages.fetch({ limit: 100, before: lastMessageId || undefined });
            messages = messages.concat(Array.from(lastMessage));
            lastMessageId = lastMessage.lastKey();
        } while (lastMessage.size === 100);
        const normalizedMessages = normalizeMessages(messages);
        // Create the directory if it doesn't exist
        if (!fs_1.default.existsSync(`guild-${guild.id}`)) {
            fs_1.default.mkdirSync(`guild-${guild.id}`);
        }
        // Save the messages to a file
        fs_1.default.writeFileSync(`guild-${guild.id}/messages-${channelID}.json`, JSON.stringify(normalizedMessages, null, 2));
        console.log(`Fetched ${messages.length} messages from channel ${channel === null || channel === void 0 ? void 0 : channel.name} (${channelID}).`);
    }
    console.log("Finished scraping all channels.");
    client.destroy();
}));
client.login(process.env.TOKEN);
