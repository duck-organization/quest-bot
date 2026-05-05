import { Listener } from '@sapphire/framework';
import { EmbedBuilder, Colors, type Message } from 'discord.js';
import { logEmbed, truncate } from '#lib/logging.js';

export class MessageUpdateListener extends Listener {
  public constructor(context: Listener.LoaderContext, options: Listener.Options) {
    super(context, { ...options, event: 'messageUpdate' as any });
  }

  public async run(oldMessage: unknown, newMessage: unknown) {
    const oldMsg = oldMessage as Message | null;
    const newMsg = newMessage as Message;
    const guild = newMsg.guild ?? oldMsg?.guild;
    if (!guild) return;

    if (oldMsg && oldMsg.content === newMsg.content) return;

    const embed = new EmbedBuilder()
      .setTitle('Message Edited')
      .setColor(Colors.Orange)
      .addFields(
        { name: 'Channel', value: newMsg.channel?.toString() ?? 'Unknown', inline: true },
        { name: 'Author', value: newMsg.author?.tag ?? oldMsg?.author?.tag ?? 'Unknown', inline: true },
        { name: 'Before', value: truncate(oldMsg?.content) || '-' },
        { name: 'After', value: truncate(newMsg.content) || '-' }
      )
      .setFooter({ text: `ID: ${newMsg.id}` })
      .setTimestamp();

    await logEmbed(guild, embed);
  }
}
