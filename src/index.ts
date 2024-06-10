import { Client, Message } from "discord.js-selfbot-v13"
import dotenv from "dotenv";
import fs from "fs";

dotenv.config();

const client = new Client();

const channelsToScrape = [
	"1245368220865794088"
];

function normalizeMessages(messages: [string, Message<boolean>][]) {
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
				}
			}),
		}
	});
}

client.on("ready", async () => {
	console.log(`Logged in as ${client?.user?.tag}!`);

	const guild = await client.guilds.fetch("1087843967573438504");

	for (let c of guild.channels.cache.entries()) {
		const channelID = c[0];
		const channel = await guild.channels.fetch(channelID);

		if (!channel) {
			console.log(`Channel (${channelID}) not found.`);
			continue;
		}

		if (channel.parentId != "1088044992922132501") {
			continue;
		}

		if (!channel.isText()) {
			console.log(`Channel ${channel?.name} (${channelID}) is not a text channel.`);
			continue;
		}

		console.log(`Scraping channel ${channel?.name} (${channelID})...`);

		// Fetch the last 100 messages continuously until we have all messages
		let lastMessage = await channel.messages.fetch({ limit: 100 });
		let lastMessageId = lastMessage.lastKey();
		let messages = Array.from(lastMessage);

		do {
			lastMessage = await channel.messages.fetch({ limit: 100, before: lastMessageId || undefined });
			messages = messages.concat(Array.from(lastMessage));
			lastMessageId = lastMessage.lastKey();
		} while (lastMessage.size === 100);

		const normalizedMessages = normalizeMessages(messages);

		// Create the directory if it doesn't exist
		if (!fs.existsSync(`guild-${guild.id}`)) {
			fs.mkdirSync(`guild-${guild.id}`);
		}

		// Save the messages to a file
		fs.writeFileSync(`guild-${guild.id}/messages-${channelID}.json`, JSON.stringify(normalizedMessages, null, 2));

		console.log(`Fetched ${messages.length} messages from channel ${channel?.name} (${channelID}).`);
	}

	console.log("Finished scraping all channels.");
	client.destroy();
});

client.login(process.env.TOKEN);
