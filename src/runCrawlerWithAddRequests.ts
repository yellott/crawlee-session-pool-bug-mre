import { PlaywrightCrawler } from 'crawlee';

function* getUrls() {
    for (let i = 0; i < 10; i++) {
        yield `http://localhost:3000/root?key=${i.toString()}`;
    }
}

const urlGenerator = getUrls();

const sessionStats: Record<string, { urls: string[]; count: number }> = {};

/*
    CASE 1:

        Running this configuration reports 22 sessions total in SDK_SESSION_POOL_STATE.json -
        where "usageCount" 11 of them equals to 0 while "usageCount" of 11 another sessions equals to 4.

        Session stats collected manually report that there were used 11 session in total where each session was used once,
        see consolge.log at the bottom of this file.

        To sum up, manually collected stats seems to be correct.
        One url was provided in "playwrightCrawler.run" call and another 10 were added one by one via "crawler.addRequests" call.

    CASE 2:

        If "autoscaledPoolOptions.maxConcurrency" is set to 1 nothing changes, behaves the same as in " CASE 1"

    CASE 3:

        If the rest of url added at once via "crawler.addRequests" then there are 17 sessions total in SDK_SESSION_POOL_STATE.json -
        where "usageCount" 11 of them equals to 0 while "usageCount" of 5 another sessions equals to 8, and one session with "usageCount" equals to 4
 */

export async function runCrawlerWithAddRequests() {
    const playwrightCrawler = new PlaywrightCrawler({
        sessionPoolOptions: {
            sessionOptions: {
                maxUsageCount: 1,
            },
        },
        // Uncomment this to see "CASE 2" is the same as "CASE 1"
        /* autoscaledPoolOptions: {
            maxConcurrency: 1,
        }, */
        requestHandler: async ({ session, request, crawler }) => {
            if (session) {
                const data = sessionStats[session.id] ?? { urls: [], count: 0 };
                data.count += 1;
                data.urls.push(request.url);
                sessionStats[session.id] = data;
            }

            const next = urlGenerator.next();
            if (!next.done) {
                await crawler.addRequests([next.value]);
            }
            // Comment "crawler.addRequests" above and uncomment this to see "CASE 3"
            // await crawler.addRequests(Array.from(urlGenerator));
        },
    });

    await playwrightCrawler.run(['http://localhost:3000/root']);

    console.log('Sessions', JSON.stringify(sessionStats, null, 4));
    console.log('Sessions used count', Object.keys(sessionStats).length);
}
