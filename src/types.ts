

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
	// Maximum number of messages to scrape
	max?: number;

	// Path where downloads will be saved
	downloadPath?: string;

	// Whether to download embed attachments
	downloadEmbedAttachments?: boolean;

	// Whether to download message attachments
	downloadMessageAttachments?: boolean;

	// Regular expression to match attachment names for downloading
	matchAttachmentName?: RegExp;
}