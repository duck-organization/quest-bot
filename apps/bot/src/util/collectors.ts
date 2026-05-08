import type { Message, MessageComponentInteraction } from 'discord.js';

export async function awaitMessageComponentSafe(
  message: Message,
  options: { filter?: (i: any) => boolean; time?: number }
): Promise<MessageComponentInteraction | null> {
  return new Promise((resolve) => {
    const collector = message.createMessageComponentCollector({
      filter: options.filter ?? (() => true),
      time: options.time ?? 60_000
    } as any);
    collector.on('error', (err: unknown) => {
      console.debug('[awaitMessageComponentSafe] collector error', err);
      resolve(null);
    });

    collector.on('collect', (i: MessageComponentInteraction) => {
      collector.stop('collected');
      resolve(i);
    });

    collector.on('end', (collected: any, reason: string) => {
      if (reason === 'time' || collected.size === 0) {
        resolve(null);
      }
    });
  });
}

export default awaitMessageComponentSafe;
