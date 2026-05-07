import { Command } from '@sapphire/framework';
import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  EmbedBuilder,
  LabelBuilder,
  MessageFlags,
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle,
  TextChannel
} from 'discord.js';
import { getSettings } from '#lib/settings.js';
import { storeConfessionContext } from '#lib/confessions.js';
import { emojis } from '#utils/emoji.js';

export class ConfessCommand extends Command {
  public constructor(context: Command.LoaderContext, options: Command.Options) {
    super(context, { ...options });
  }

  public override registerApplicationCommands(_registry: Command.Registry) {
    // Registration is handled per-guild at runtime in the Ready listener
  }

  public override async chatInputRun(interaction: Command.ChatInputCommandInteraction) {
    if (!interaction.inGuild() || !interaction.guild) {
      await interaction.reply({ content: `${emojis.rightArrow2} This command can only be used in a server.`, flags: MessageFlags.Ephemeral });
      return;
    }

    const settings = await getSettings(interaction.guild.id, interaction.guild.name);

    if (!settings.confessionChannelId || !settings.confessionEnabled) {
      await interaction.reply({ content: `${emojis.rightArrow2} Confessions are not enabled or configured for this server.`, flags: MessageFlags.Ephemeral });
      return;
    }

    const confessionInput = new TextInputBuilder()
      .setCustomId('confession-text')
      .setStyle(TextInputStyle.Paragraph)
      .setRequired(true)
      .setMaxLength(1_000);

    const confessionLabel = new LabelBuilder().setLabel('Confession').setTextInputComponent(confessionInput);

    const modal = new ModalBuilder().setCustomId('create-confession-modal').setTitle('Create Confession').addLabelComponents(confessionLabel);

    await interaction.showModal(modal);

    let modalSubmit;

    try {
      modalSubmit = await interaction.awaitModalSubmit({
        filter: (m) => m.customId === 'create-confession-modal' && m.user.id === interaction.user.id,
        time: 60_000
      });
    } catch {
      return;
    }

    const confession = modalSubmit.fields.getTextInputValue('confession-text');

    const confessionChannel = await interaction.guild.channels.fetch(settings.confessionChannelId).catch(() => null);

    if (!(confessionChannel instanceof TextChannel)) {
      await modalSubmit.reply({ content: `${emojis.rightArrow2} The configured confession channel is unavailable.`, flags: MessageFlags.Ephemeral });
      return;
    }

    const embed = new EmbedBuilder().setTitle('Confession').setDescription(confession).setTimestamp();

    const message = await confessionChannel.send({ embeds: [embed] });

    let thread;

    try {
      thread = await message.startThread({ name: `confession-${message.id}` });
    } catch (error) {
      await message.delete().catch(() => null);
      throw error;
    }

    const reportButton = new ButtonBuilder().setCustomId(`report-confession:${message.id}`).setLabel('Report').setStyle(ButtonStyle.Danger);
    const row = new ActionRowBuilder<ButtonBuilder>().addComponents(reportButton);

    await message.edit({ components: [row] });

    storeConfessionContext({ guildId: interaction.guild.id, channelId: confessionChannel.id, messageId: message.id, threadId: thread.id });

    await modalSubmit.reply({ content: `${emojis.rightArrow2} Confession sent.`, flags: MessageFlags.Ephemeral });
  }
}
