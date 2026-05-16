import { Listener } from '@sapphire/framework';
import { AuditLogEvent, EmbedBuilder, Events, type Guild, type GuildAuditLogsEntry } from 'discord.js';

export class GuildAuditLogEntryCreateListener extends Listener<typeof Events.GuildAuditLogEntryCreate> {
  public constructor(context: Listener.LoaderContext, options: Listener.Options) {
    super(context, { ...options, event: Events.GuildAuditLogEntryCreate });
  }

  public async run(entry: GuildAuditLogsEntry, guild: Guild) {
    if (entry.action !== AuditLogEvent.MemberKick) return;
    const kickEntry = entry as GuildAuditLogsEntry<AuditLogEvent.MemberKick>;
    if (kickEntry.target?.id !== guild.client.user.id) return;

    const remover = kickEntry.executor;
    if (!remover) return;

    const embed = new EmbedBuilder()
      .setColor(0xffffff)
      .setTitle('Sorry to see you go!')
      .setDescription(`If you had any issues or feedback, feel free to join the support server by using the \`/discord\` command.\n\nWe'd also appreciate it if you could fill out our feedback form at https://duckorg.com/feedback/questbot!`);

    await remover.send({ embeds: [embed] }).catch(() => null);
  }
}
