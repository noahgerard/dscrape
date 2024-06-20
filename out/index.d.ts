import { Client, Collection, GuildBasedChannel } from "discord.js-selfbot-v13";
import { ScrapeOptions } from "./types";
export declare class DScraper {
    client: Client;
    baseOptions: ScrapeOptions;
    constructor();
    login(token: string, options?: ScrapeOptions): Promise<this>;
    getTextChannels(guildID: string): Promise<Collection<string, GuildBasedChannel>>;
    getCategoryTextChannels(guildID: string, categoryID: string): Promise<Collection<string, GuildBasedChannel>>;
    scrapeChannel(channelID: string, options?: ScrapeOptions): Promise<{
        id: string;
        createdTimestamp: number;
        content: string;
        embeds: import("discord.js-selfbot-v13").MessageEmbed[];
        attachments: {
            url: string;
            filename: string | null;
        }[];
    }[]>;
    quit(): Promise<void>;
}
//# sourceMappingURL=index.d.ts.map