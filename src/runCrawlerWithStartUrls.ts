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

        Running  this configuration reports 15 sessions total in SDK_SESSION_POOL_STATE.json -
        where "usageCount" 10 of them equals to 0  while "usageCount" of 5 another sessions equals to 8.

        Session stats collected manually report that there were used 5 session in total, where each session was used twice,
        see consolge.log at the bottom of this file.

    CASE 2:

        If "autoscaledPoolOptions.maxConcurrency" is set to 1 then there are 20 sessions in SDK_SESSION_POOL_STATE.json -
        where "usageCount" 10 of them equals to 0 while "usageCount" of 10 another sessions equals to 4.

        Session stats collected manually report that there were used 10 session in total, where each session was used once,
        see consolge.log at the bottom of this file.

        To sum up, manually collected stats seems to be correct for this case.
        There were 10 url added via "playwrightCrawler.run" call.

 */
export async function runCrawlerWithStartUrls() {
    const playwrightCrawler = new PlaywrightCrawler({
        sessionPoolOptions: {
            sessionOptions: {
                maxUsageCount: 1,
            },
        },
        // Uncomment this to see "CASE 2"
        /* autoscaledPoolOptions: {
            maxConcurrency: 1,
        }, */
        requestHandler: async ({ session, request }) => {
            if (session) {
                const data = sessionStats[session.id] ?? { urls: [], count: 0 };
                data.count += 1;
                data.urls.push(request.url);
                sessionStats[session.id] = data;
            }
        },
    });

    await playwrightCrawler.run(Array.from(getUrls()));

    console.log('Sessions', JSON.stringify(sessionStats, null, 4));
    console.log('Sessions used count', Object.keys(sessionStats).length);
}
