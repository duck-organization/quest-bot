import { Listener } from '@sapphire/framework';
import { Events, EmbedBuilder, Colors, type Message, type PartialMessage } from 'discord.js';
import { removeConfessionContext } from '#lib/confessions.js';
import { isLoggingChannel, logEmbed, truncate } from '#lib/logging.js';

export class MessageDeleteListener extends Listener<typeof Events.MessageDelete> {
  public constructor(context: Listener.LoaderContext, options: Listener.Options) {
    super(context, { ...options, event: Events.MessageDelete });
  }

  public async run(message: Message | PartialMessage) {
    const guild = message.guild;
    if (!guild) return;
    if (await isLoggingChannel(guild, message.channel?.id)) return;

    const embed = new EmbedBuilder()
      .setTitle('Message Deleted')
      .setColor(Colors.Red)
      .addFields(
        { name: 'Channel', value: message.channel?.toString() ?? 'Unknown', inline: true },
        { name: 'Author', value: message.author?.tag ?? 'Unknown', inline: true },
        { name: 'Content', value: truncate(message instanceof Object ? (message as Message).content : undefined, 1024) || '-' }
      )
      .setFooter({ text: `ID: ${message.id}` })
      .setTimestamp();

    await removeConfessionContext(message.id).catch(() => null);
    await logEmbed(guild, embed);
  }
}
