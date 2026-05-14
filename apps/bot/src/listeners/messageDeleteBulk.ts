import { Listener } from '@sapphire/framework';
import { EmbedBuilder, type Collection } from 'discord.js';
import { removeConfessionContexts } from '#lib/confessions.js';
import { isLoggingChannel, logEmbed } from '#lib/logging.js';

export class MessageDeleteBulkListener extends Listener {
  public constructor(context: Listener.LoaderContext, options: Listener.Options) {
    super(context, { ...options, event: 'messageDeleteBulk' as any });
  }

  public async run(messages: Collection<string, any>) {
    const first = messages.first();
    const guild = first?.guild;
    if (!guild) return;
    if (await isLoggingChannel(guild, first?.channel?.id)) return;

    const channel = first?.channel?.toString() ?? 'Unknown';

    const embed = new EmbedBuilder()
      .setTitle('Bulk Messages Deleted')
      .setColor(0xFF6962)
      .addFields(
        { name: 'Channel', value: channel, inline: true },
        { name: 'Count', value: `${messages.size}`, inline: true }
      )
      .setTimestamp();

    await removeConfessionContexts([...messages.keys()]).catch(() => null);
    await logEmbed(guild, embed);
  }
}
