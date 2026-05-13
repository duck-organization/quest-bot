import { Listener } from '@sapphire/framework';
import { Events, type Guild } from 'discord.js';
import { prisma } from '#lib/prisma.js';

export class GuildDeleteListener extends Listener<typeof Events.GuildDelete> {
  public constructor(context: Listener.LoaderContext, options: Listener.Options) {
    super(context, { ...options, event: Events.GuildDelete });
  }

  public async run(guild: Guild) {
    await prisma.server.delete({ where: { id: guild.id } }).catch(() => null);
  }
}
