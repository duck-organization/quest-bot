import { Command } from '@sapphire/framework';
import { emojis } from '#utils/emoji.js';
import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  ChannelType,
  MessageFlags,
  PermissionFlagsBits
} from 'discord.js';
import { updateSettings } from '#lib/settings.js';

export class SetupConfessionsCommand extends Command {
  public constructor(context: Command.LoaderContext, options: Command.Options) {
    super(context, { ...options });
  }

  public override registerApplicationCommands(registry: Command.Registry) {
    registry.registerChatInputCommand((builder) =>
      builder
        .setName('setup-confessions')
        .setDescription('Post the confession panel in a channel.')
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
        .addChannelOption((option) =>
          option
            .setName('panel-channel')
            .setDescription('The channel where the confession panel should be posted')
            .addChannelTypes(ChannelType.GuildText)
            .setRequired(true)
        )
        .addChannelOption((option) =>
          option
            .setName('confession-channel')
            .setDescription('The channel where confessions should be sent')
            .addChannelTypes(ChannelType.GuildText)
            .setRequired(true)
        )
    );
  }

  public override async chatInputRun(interaction: Command.ChatInputCommandInteraction) {
    if (!interaction.guild) {
      await interaction.reply({
        content: `${emojis.rightArrow2} This command can only be used in a server.`,
        flags: MessageFlags.Ephemeral
      });
      return;
    }

    const panelChannel = interaction.options.getChannel('panel-channel', true, [ChannelType.GuildText]);
    const confessionChannel = interaction.options.getChannel('confession-channel', true, [ChannelType.GuildText]);

    const button = new ButtonBuilder()
      .setCustomId('create-confession')
      .setLabel('Create Confession')
      .setStyle(ButtonStyle.Success);

    const row = new ActionRowBuilder<ButtonBuilder>().addComponents(button);

    await panelChannel.send({
      content: `**Create a confession by clicking the button below!**`,
      components: [row]
    });

    await updateSettings(interaction.guild.id, interaction.guild.name, {
      confessionChannelId: confessionChannel.id
    });

    await interaction.reply({
      content: `${emojis.rightArrow2} Confession panel sent in ${panelChannel}. Confessions will be posted in ${confessionChannel}.`,
      flags: MessageFlags.Ephemeral
    });
  }
}