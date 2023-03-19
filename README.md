### This is example of weired behavior of SessionPool from crawlee package. SessionPool generates more sessions that needed and also does not respect `maxUsageCount` constraint. At the first look seems to be another concurrency issue.
#### Install deps 
```sh
npm i
```
#### Run fake server 
```sh
npm run fake-server 
```

#### Run crawler
```sh
npm run start
```


#### There are two examples imported in `main.ts` file
```sh
import { Actor, log } from 'apify';
import { runCrawlerWithAddRequests } from './runCrawlerWithAddRequests.js';
import { runCrawlerWithStartUrls } from './runCrawlerWithStartUrls.js';

log.setLevel(log.LEVELS.DEBUG);

await Actor.init();

await runCrawlerWithAddRequests();

await Actor.exit();

```
#### One of them adds all urls at `craler.run`, while another one adds single request via `craler.run` and the rest via `crawler.addRequests`.
#### Run each of those examples and compare the content of `SDK_SESSION_POOL_STATE.json` with manually collected session usage stats displayed in console.
