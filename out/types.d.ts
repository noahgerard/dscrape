/**
 * Options for scraping messages
 *
 * @export
 * @interface ScrapeOptions
 * @property {number} [max] Maximum number of messages to scrape
 * @property {string} [downloadPath] Path where downloads will be saved
 * @property {boolean} [downloadEmbedAttachments] Whether to download embed attachments
 * @property {boolean} [downloadMessageAttachments] Whether to download message attachments
 * @property {RegExp} [matchAttachmentName] Regular expression to match attachment names for downloading
 */
export interface ScrapeOptions {
    max?: number;
    downloadPath?: string;
    downloadEmbedAttachments?: boolean;
    downloadMessageAttachments?: boolean;
    matchAttachmentName?: RegExp;
}
//# sourceMappingURL=types.d.ts.map