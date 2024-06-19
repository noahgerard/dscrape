# dscrape
Scrape messages and attachments from Discord channels.

### Disclaimer
*This program utilizes a userbot to scrape messages and attachments! This is against Discord's ToS and can get your account banned. Use at your own risk! This program is purely for educational purposes.*

### TODO
- [ ] Scrape member data (pfp, banner, badges etc.)
- [ ] Unit tests
- [ ] Documentation
- [x] Publish to npm 💃

### Example
```js
import { DScraper } from "dscrape";

(async () => {
	const scraper = new DScraper();
	await scraper.login("BOT_TOKEN");

	const channels = await scraper.getCategoryTextChannels("GUILD_ID", "CATEGORY_ID");

	for (const [id, channel] of channels) {
		try {
			console.log(`Scraping ${channel.name} (${id})...`);
			const messages = await scraper.scrapeChannel(id);
			console.log(`Scraped ${messages.length} messages.`);
		} catch (error) {
			console.error(`Error scraping ${channel.name} (${id}): ${error}`);
		}
	}
})();
```