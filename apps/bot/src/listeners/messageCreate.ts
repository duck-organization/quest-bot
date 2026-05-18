import { Listener } from '@sapphire/framework';
import { Events, type Message } from 'discord.js';
import { getAutoMods } from '#lib/automod.js';

export class MessageCreateListener extends Listener<typeof Events.MessageCreate> {
	public constructor(context: Listener.LoaderContext, options: Listener.Options) {
		super(context, {
			...options,
			event: Events.MessageCreate,
		});
	}

	public async run(message: Message) {
		if (message.author.bot) return;
		if (!message.guild) return;

		const autoMods = await getAutoMods(message.guild.id);
		const content = message.content.toLowerCase();

		for (const autoMod of autoMods) {
			if (!autoMod.word.trim()) continue;
			if (content.includes(autoMod.word.toLowerCase())) {
				await message.delete().catch((err) => console.error(err));

				const channel = message.channel;
				if (!channel.isTextBased() || !channel.isSendable()) return;

				await channel.send(`<@${message.author.id}>, that word is not allowed here!`).catch((err) => {
					console.error(err);
				});

				break;
			}
		}

		const moderatorIds = [
			...new Set(
				(process.env.MODERATORS ?? '')
					.split(',')
					.map((id) => id.trim())
					.filter(Boolean),
			),
		];

		if (moderatorIds.includes(message.author.id)) {
			if (content.includes('<@1494686224508522579>')) {
				await message.reply('Why hello there!').catch((err) => console.error(err));
			}
		}
	}
}
