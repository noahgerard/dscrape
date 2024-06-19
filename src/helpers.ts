import { Message } from "discord.js-selfbot-v13";
import fs from "fs";
import axios from "axios";

import { ScrapeOptions } from "./types";

export function normalizeMessages(messages: [string, Message<boolean>][]) {
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

export async function downloadAttachments(messages: [string, Message<boolean>][], options?: ScrapeOptions) {
	if (!options?.downloadPath) {
		throw new Error("Download path is not defined.");
	}

	// Create the directory if it doesn't exist
	if (!fs.existsSync(options.downloadPath!)) {
		fs.mkdirSync(options.downloadPath!);
	}

	for (let i = 0; i < messages.length; i++) {
		const message = messages[i][1];

		if (options?.downloadMessageAttachments && message.attachments.size > 0) {
			await new Promise((resolve) => setTimeout(resolve, 100));

			for (let j = 0; j < message.attachments.size; j++) {
				const attachment = message.attachments.at(j);

				if (!attachment) {
					continue;
				}

				/* if (attachment.name && !options.matchAttachmentName?.test(attachment.name)) {
					continue;
				} */

				const url = attachment.url;
				const filename = attachment.name;

				await axios({
					method: "GET",
					url: url,
					responseType: "stream",
				}).then((response) => {
					response.data.pipe(fs.createWriteStream(`${options.downloadPath}/${message.id}-a${j}-${filename}`));
				}).catch((error) => {
					console.error(`Failed to download ${filename} (${message.id}): ${error}`);
				});
			}
		}

		if (options?.downloadEmbedAttachments && message.embeds.length > 0) {
			// TODO: Implement downloading embed attachments

			/* for (let j = 0; j < message.embeds.length; j++) {
				const embed = message.embeds[j];
				const url = embed.image?.url || embed.image?.proxyURL;

				if (!url) continue;

				await axios({
					method: "GET",
					url: url,
					responseType: "stream",
				}).then((response) => {
					response.data.pipe(fs.createWriteStream(`${options.downloadPath}/${message.id}-e${whatdoinamethislol}`));
				}).catch((error) => {
					console.error(`Failed to download ${url} (${message.id}): ${error}`);
				});
			} */
		}
	}
}