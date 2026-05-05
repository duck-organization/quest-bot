import process from 'node:process';
import { fileURLToPath } from 'node:url';
import {
  ApplicationCommandRegistries,
  RegisterBehavior,
  SapphireClient
} from '@sapphire/framework';
import { GatewayIntentBits, Partials } from 'discord.js';

ApplicationCommandRegistries.setDefaultBehaviorWhenNotIdentical(
  RegisterBehavior.BulkOverwrite
);

const client = new SapphireClient({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildModeration,
    GatewayIntentBits.GuildExpressions
  ],
  partials: [Partials.Message, Partials.Channel],
  presence: {
    status: 'online'
  },
  baseUserDirectory: fileURLToPath(new URL('.', import.meta.url))
});

void client.login(process.env.DISCORD_TOKEN);
