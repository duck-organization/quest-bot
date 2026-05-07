export type ConfessionContext = {
    guildId: string;
    channelId: string;
    messageId: string;
    threadId: string;
};

const confessionContexts = new Map<string, ConfessionContext>();

export function getModeratorIds() {
    return [...new Set((process.env.MODERATORS ?? '').split(',').map((id) => id.trim()).filter(Boolean))];
}

export function buildConfessionLink(guildId: string, channelId: string, messageId: string) {
    return `https://discord.com/channels/${guildId}/${channelId}/${messageId}`;
}

export function storeConfessionContext(context: ConfessionContext) {
    confessionContexts.set(context.messageId, context);
}

export function getConfessionContext(messageId: string) {
    return confessionContexts.get(messageId) ?? null;
}

export function removeConfessionContext(messageId: string) {
    confessionContexts.delete(messageId);
}