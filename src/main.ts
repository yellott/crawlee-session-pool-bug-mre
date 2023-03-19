import { Actor, log } from 'apify';
import { runCrawlerWithAddRequests } from './runCrawlerWithAddRequests.js';
import { runCrawlerWithStartUrls } from './runCrawlerWithStartUrls.js';

log.setLevel(log.LEVELS.DEBUG);

await Actor.init();
await runCrawlerWithAddRequests();
await Actor.exit();
