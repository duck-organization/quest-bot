import { Listener } from '@sapphire/framework';
import { EmbedBuilder, Colors, type GuildEmoji, type Collection, type Guild } from 'discord.js';
import { logEmbed } from '#lib/logging.js';

export class GuildEmojisUpdateListener extends Listener {
	public constructor(context: Listener.LoaderContext, options: Listener.Options) {
		super(context, { ...options, event: 'guildEmojisUpdate' as any });
	}

	public async run(guild: Guild, oldEmojis: Collection<string, GuildEmoji>, newEmojis: Collection<string, GuildEmoji>) {
		const created = newEmojis.filter((e) => !oldEmojis.has(e.id));
		const deleted = oldEmojis.filter((e) => !newEmojis.has(e.id));
		const updated = newEmojis.filter((e) => {
			const old = oldEmojis.get(e.id);
			return old && (old.name !== e.name || old.animated !== e.animated);
		});

		if (created.size === 0 && deleted.size === 0 && updated.size === 0) return;

		const embed = new EmbedBuilder().setTitle('Guild Emojis Updated').setColor(Colors.Blue).setTimestamp();

		if (created.size > 0)
			embed.addFields({ name: `Created (${created.size})`, value: created.map((e) => `${e}`).join(' ') });
		if (deleted.size > 0)
			embed.addFields({ name: `Deleted (${deleted.size})`, value: deleted.map((e) => e.name).join(', ') });
		if (updated.size > 0)
			embed.addFields({ name: `Updated (${updated.size})`, value: updated.map((e) => e.name).join(', ') });

		await logEmbed(guild, embed);
	}
}
