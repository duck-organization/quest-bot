import type { Client } from 'discord.js';
import { emojis } from '#utils/emoji.js';
import { getDueReminders, removeReminder } from './reminders.js';

function ownerShardId(snowflake: string, totalShards: number) {
	return Number((BigInt(snowflake) >> 22n) % BigInt(totalShards));
}

export function reminderScheduler(client: Client) {
	const checkReminders = async () => {
		try {
			const due = await getDueReminders();
			const totalShards = client.shard?.count ?? 1;
			const shardId = client.shard?.ids[0] ?? 0;

			for (const reminder of due) {
				// each shard handles its reminders for its own guild
				const targetShard = ownerShardId(reminder.guildId ?? reminder.userId, totalShards);
				if (targetShard !== shardId) continue;

				try {
					let sent = false;
					if (reminder.channelId) {
						const channel = client.channels.cache.get(reminder.channelId);
						if (channel?.isSendable()) {
							await channel.send({
								content: `${emojis.rightArrow2} <@${reminder.userId}> reminder: ${reminder.message ?? 'No message provided'}`,
							});
							sent = true;
						}
					}
					if (!sent) {
						await dmUser(client, reminder.userId, reminder.message);
					}

					await removeReminder(reminder.id);
				} catch (err) {
					console.error(err);
				}
			}
		} catch (err) {
			console.error(err);
		}
	};
	checkReminders();
	setInterval(checkReminders, 30_000);
}

async function dmUser(client: Client, userId: string, message: string) {
	const user = await client.users.fetch(userId).catch(() => null);
	if (!user) return;

	await user
		.send({
			content: `${emojis.rightArrow2} <@${userId}> reminder: ${message}`,
		})
		.catch(() => {});
}
