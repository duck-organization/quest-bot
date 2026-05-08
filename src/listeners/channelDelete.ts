import { Listener } from '@sapphire/framework';
import { Events, type Channel } from 'discord.js';
import { removeConfessionContextsByChannel } from '#lib/confessions.js';

export class ChannelDeleteListener extends Listener<typeof Events.ChannelDelete> {
  public constructor(context: Listener.LoaderContext, options: Listener.Options) {
    super(context, {
      ...options,
      event: Events.ChannelDelete
    });
  }

  public async run(channel: Channel) {
    if (!('guild' in channel) || !channel.guild) return;

    await removeConfessionContextsByChannel(channel.id).catch(() => null);
  }
}