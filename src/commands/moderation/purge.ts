import { Command } from '@sapphire/framework';
import { emojis } from '#utils/emoji.js';
import { MessageFlags, PermissionsBitField } from 'discord.js';

export class PurgeCommand extends Command {
  public constructor(context: Command.LoaderContext, options: Command.Options) {
    super(context, { ...options });
  }

  public override registerApplicationCommands(registry: Command.Registry) {
    registry.registerChatInputCommand((builder) =>
      builder
        .setName('purge')
        .setDescription('Purge messages from a channel.')
        .addIntegerOption((option) =>
          option
            .setName('amount')
            .setDescription('The number of messages to purge')
            .setRequired(true)
            .setMinValue(1)
            .setMaxValue(1000)
        )
    );
  }

  public override async chatInputRun(interaction: Command.ChatInputCommandInteraction) {
    if (!interaction.inCachedGuild()) {
      await interaction.reply({
        content: `${emojis.rightArrow2} This command can only be used in a server.`,
        flags: MessageFlags.Ephemeral
      });
      return;
    }

    const member = interaction.member;

    if (!member || !('permissions' in member) || !member.permissions.has(PermissionsBitField.Flags.ManageMessages)) {
      await interaction.reply({
        content: `${emojis.rightArrow2} You do not have permission to manage messages.`,
        flags: MessageFlags.Ephemeral
      });
      return;
    }

    const amount = interaction.options.getInteger('amount') ?? 0;
    if (amount <= 0) {
      await interaction.reply({
        content: `${emojis.rightArrow2} Please provide a valid number of messages to purge.`,
        flags: MessageFlags.Ephemeral
      });
      return;
    }

    const channel = interaction.channel;
    if (!channel || !('messages' in channel)) {
      await interaction.reply({
        content: `${emojis.rightArrow2} Unable to access channel messages.`,
        flags: MessageFlags.Ephemeral
      });
      return;
    }

    await interaction.deferReply({ ephemeral: true });

    let remaining = amount;
    let deletedTotal = 0;

    try {
      while (remaining > 0) {
        const fetchLimit = Math.min(remaining, 100);
        const fetched = await channel.messages.fetch({ limit: fetchLimit as number });
        if (!fetched.size) break;

        const deleted = await channel.bulkDelete(fetched, true);
        if (!deleted.size) break;

        deletedTotal += deleted.size;
        remaining -= deleted.size;
      }

      await interaction.editReply(`${emojis.rightArrow1} Successfully purged ${deletedTotal} messages.`);
    } catch (err) {
      console.error(err);
      await interaction.editReply({
        content: `${emojis.rightArrow2} An error occurred while trying to purge messages.`,
      });
    }
  }
}