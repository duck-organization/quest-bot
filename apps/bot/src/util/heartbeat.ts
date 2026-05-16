import type { Client } from 'discord.js';

export function heartbeat(client: Client) {
    const pushURLs = process.env['KUMA_PUSH_URL']?.split(',').map((url) => url.trim()).filter(Boolean) ?? [];
    const shardId = client.shard?.ids?.[0] ?? 0;
    const pushURL = pushURLs[shardId] ?? pushURLs[0];

    if (!pushURL) return;

    const push = async () => {
        if (!client.isReady()) return;

        try {
            const url = new URL(pushURL);
            url.searchParams.set('ping', String(client.ws.ping));
            await fetch(url);
        } catch (err) {
            console.error('Push failed:', err);
        }
    };

    void push();
    setInterval(push, 60_000);
}
