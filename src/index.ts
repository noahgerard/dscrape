import { BaseGuildTextChannel, CategoryChannel, Client, Collection, GuildBasedChannel } from "discord.js-selfbot-v13"
import { downloadAttachments, normalizeMessages } from "./helpers";
import { ScrapeOptions } from "./types";

export class DScraper {
	client: Client;
	baseOptions: ScrapeOptions = {
		downloadPath: "attachments",
		downloadEmbedAttachments: true,
		downloadMessageAttachments: true,
		// matchAttachmentName: /./,
	};

	constructor() {
		this.client = new Client();
	}

	async login(token: string, options?: ScrapeOptions) {
		this.baseOptions = { ...this.baseOptions, ...options };

		let loggedIn = false;

		this.client.once("ready", () => {
			loggedIn = true;
		});

		await this.client.login(token);

		// Wait for the client to log in
		while (!loggedIn) {
			await new Promise((resolve) => setTimeout(resolve, 100));
		}

		return this;
	}

	async getTextChannels(guildID: string) {
		const guild = await this.client.guilds.fetch(guildID);

		const channels = guild.channels.cache.filter((channel) => {
			return channel.isText();
		});

		return channels;
	}

	async getCategoryTextChannels(guildID: string, categoryID: string) {
		const guild = await this.client.guilds.fetch(guildID);

		const category = guild.channels.cache.find((channel) => {
			return channel.type === "GUILD_CATEGORY" && channel.id === categoryID;
		}) as CategoryChannel;

		if (!category) {
			throw new Error(`Category (${categoryID}) not found.`);
		}

		const channels = category.children.filter((channel) => {
			return channel.isText();
		});

		return channels as Collection<string, GuildBasedChannel>;
	}

	async scrapeChannel(channelID: string, options?: ScrapeOptions) {
		options = options || this.baseOptions;

		let channel: BaseGuildTextChannel;
		try {
			channel = await this.client.channels.fetch(channelID) as BaseGuildTextChannel;
		} catch (error) {
			throw new Error(`Error fetching channel (${channelID}): ${error}`);
		}

		if (!channel) {
			throw new Error(`Channel (${channelID}) not found.`);
		}

		if (!channel.isText()) {
			throw new Error(`Channel ${channel?.name} (${channelID}) is not a text channel.`);
		}

		// Fetch the last 100 messages continuously until we have all messages
		let lastMessage = await channel.messages.fetch({ limit: 100 });
		let lastMessageId = lastMessage.lastKey();
		let messages = Array.from(lastMessage);

		if (messages.length == 100) {
			while (lastMessage.size === 100) {
				lastMessage = await channel.messages.fetch({ limit: 100, before: lastMessageId || undefined });
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

		const normalizedMessages = normalizeMessages(messages);

		if (options.downloadMessageAttachments || options.downloadEmbedAttachments) {
			// Download attachments
			await downloadAttachments(messages, options);
		}

		return normalizedMessages;
	}

	async quit() {
		this.client.destroy();
	}
}