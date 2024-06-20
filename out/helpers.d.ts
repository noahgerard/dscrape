import { Message } from "discord.js-selfbot-v13";
import { ScrapeOptions } from "./types";
export declare function normalizeMessages(messages: [string, Message<boolean>][]): {
    id: string;
    createdTimestamp: number;
    content: string;
    embeds: import("discord.js-selfbot-v13").MessageEmbed[];
    attachments: {
        url: string;
        filename: string | null;
    }[];
}[];
export declare function downloadAttachments(messages: [string, Message<boolean>][], options?: ScrapeOptions): Promise<void>;
//# sourceMappingURL=helpers.d.ts.map