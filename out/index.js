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
Object.defineProperty(exports, "__esModule", { value: true });
exports.DScraper = void 0;
const discord_js_selfbot_v13_1 = require("discord.js-selfbot-v13");
const helpers_1 = require("./helpers");
class DScraper {
    constructor() {
        this.baseOptions = {
            downloadPath: "attachments",
            downloadEmbedAttachments: true,
            downloadMessageAttachments: true,
            // matchAttachmentName: /./,
        };
        this.client = new discord_js_selfbot_v13_1.Client();
    }
    login(token, options) {
        return __awaiter(this, void 0, void 0, function* () {
            this.baseOptions = Object.assign(Object.assign({}, this.baseOptions), options);
            let loggedIn = false;
            this.client.once("ready", () => {
                loggedIn = true;
            });
            yield this.client.login(token);
            // Wait for the client to log in
            while (!loggedIn) {
                yield new Promise((resolve) => setTimeout(resolve, 100));
            }
            return this;
        });
    }
    getTextChannels(guildID) {
        return __awaiter(this, void 0, void 0, function* () {
            const guild = yield this.client.guilds.fetch(guildID);
            const channels = guild.channels.cache.filter((channel) => {
                return channel.isText();
            });
            return channels;
        });
    }
    getCategoryTextChannels(guildID, categoryID) {
        return __awaiter(this, void 0, void 0, function* () {
            const guild = yield this.client.guilds.fetch(guildID);
            const category = guild.channels.cache.find((channel) => {
                return channel.type === "GUILD_CATEGORY" && channel.id === categoryID;
            });
            if (!category) {
                throw new Error(`Category (${categoryID}) not found.`);
            }
            const channels = category.children.filter((channel) => {
                return channel.isText();
            });
            return channels;
        });
    }
    scrapeChannel(channelID, options) {
        return __awaiter(this, void 0, void 0, function* () {
            options = options || this.baseOptions;
            let channel;
            try {
                channel = (yield this.client.channels.fetch(channelID));
            }
            catch (error) {
                throw new Error(`Error fetching channel (${channelID}): ${error}`);
            }
            if (!channel) {
                throw new Error(`Channel (${channelID}) not found.`);
            }
            if (!channel.isText()) {
                throw new Error(`Channel ${channel === null || channel === void 0 ? void 0 : channel.name} (${channelID}) is not a text channel.`);
            }
            // Fetch the last 100 messages continuously until we have all messages
            let lastMessage = yield channel.messages.fetch({ limit: 100 });
            let lastMessageId = lastMessage.lastKey();
            let messages = Array.from(lastMessage);
            if (messages.length == 100) {
                while (lastMessage.size === 100) {
                    lastMessage = yield channel.messages.fetch({ limit: 100, before: lastMessageId || undefined });
                    messages = messages.concat(Array.from(lastMessage));
                    lastMessageId = lastMessage.lastKey();
                    if (options.max && messages.length >= options.max) {
                        break;
                    }
                }
            }
            if (options.max && messages.length > options.max) {
                messages = messages.slice(0, options.max);
            }
            const normalizedMessages = (0, helpers_1.normalizeMessages)(messages);
            if (options.downloadMessageAttachments || options.downloadEmbedAttachments) {
                // Download attachments
                yield (0, helpers_1.downloadAttachments)(messages, options);
            }
            return normalizedMessages;
        });
    }
    quit() {
        return __awaiter(this, void 0, void 0, function* () {
            this.client.destroy();
        });
    }
}
exports.DScraper = DScraper;
