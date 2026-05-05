import { EmbedBuilder, type Guild } from 'discord.js';
import { getSettings } from '#lib/settings.js';

export async function logEmbed(guild: Guild, embed: EmbedBuilder) {
  const settings = await getSettings(guild.id, guild.name).catch((err) => {
    console.error(err);
    return null;
  });

  if (!settings || !settings.loggingEnabled || !settings.loggingChannelId) return;

  const channel = await guild.channels.fetch(settings.loggingChannelId).catch(() => null);
  if (!channel?.isTextBased() || !channel.isSendable()) return;

  await channel.send({ embeds: [embed] }).catch((err) => console.error(err));
}

export function truncate(text: string | null | undefined, length = 1900) {
  if (!text) return '';
  return text.length > length ? `${text.slice(0, length)}…` : text;
}
