import { InteractionHandler, InteractionHandlerTypes } from '@sapphire/framework';
import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  EmbedBuilder,
  LabelBuilder,
  MessageFlags,
  ModalBuilder,
  TextChannel,
  TextInputBuilder,
  TextInputStyle,
  type ButtonInteraction
} from 'discord.js';
import {
  getModeratorIds,
  buildConfessionLink,
  getConfessionContext,
  removeConfessionContext,
  storeConfessionContext
} from '#lib/confessions.js';
import { getSettings } from '#lib/settings.js';
import { emojis } from '#utils/emoji.js';

function parseConfessionButton(customId: string) {
  const [action, ...parts] = customId.split(':');

  if (action === 'delete-confession' && parts.length >= 3) {
    const [guildId, channelId, messageId] = parts;
    return { action, guildId, channelId, messageId };
  }

  const [messageId] = parts;
  return { action, messageId };
}

export class ConfessionButtonHandler extends InteractionHandler {
  public constructor(ctx: InteractionHandler.LoaderContext, options: InteractionHandler.Options) {
    super(ctx, {
      ...options,
      interactionHandlerType: InteractionHandlerTypes.Button
    });
  }

  public override parse(interaction: ButtonInteraction) {
    if (
      interaction.customId !== 'create-confession' &&
      !interaction.customId.startsWith('report-confession:') &&
      !interaction.customId.startsWith('delete-confession:')
    ) {
      return this.none();
    }

    return this.some();
  }

  public async run(interaction: ButtonInteraction) {
    if (interaction.customId === 'create-confession') {
      if (!interaction.inGuild() || !interaction.guild) {
        await interaction.reply({
          content: `${emojis.rightArrow2} This button can only be used in a server.`,
          flags: MessageFlags.Ephemeral
        });
        return;
      }

      const settings = await getSettings(interaction.guild.id, interaction.guild.name);

      if (!settings.confessionChannelId) {
        await interaction.reply({
          content: `${emojis.rightArrow2} Confessions are not configured yet.`,
          flags: MessageFlags.Ephemeral
        });
        return;
      }

      const confessionInput = new TextInputBuilder()
        .setCustomId('confession-text')
        .setStyle(TextInputStyle.Paragraph)
        .setRequired(true)
        .setMaxLength(1_000);

      const confessionLabel = new LabelBuilder().setLabel('Confession').setTextInputComponent(confessionInput);

      const modal = new ModalBuilder()
        .setCustomId('create-confession-modal')
        .setTitle('Create Confession')
        .addLabelComponents(confessionLabel);

      await interaction.showModal(modal);

      let modalSubmit;

      try {
        modalSubmit = await interaction.awaitModalSubmit({
          filter: (modalInteraction) =>
            modalInteraction.customId === 'create-confession-modal' &&
            modalInteraction.user.id === interaction.user.id,
          time: 60_000
        });
      } catch {
        return;
      }

      const confession = modalSubmit.fields.getTextInputValue('confession-text');
      const confessionChannel = await interaction.guild.channels.fetch(settings.confessionChannelId).catch(() => null);

      if (!(confessionChannel instanceof TextChannel)) {
        await modalSubmit.reply({
          content: `${emojis.rightArrow2} The configured confession channel is unavailable.`,
          flags: MessageFlags.Ephemeral
        });
        return;
      }

      const embed = new EmbedBuilder().setTitle('Confession').setDescription(confession).setTimestamp();

      const message = await confessionChannel.send({ embeds: [embed] });

      let thread;

      try {
        thread = await message.startThread({
          name: `confession-${message.id}`
        });
      } catch (error) {
        await message.delete().catch(() => null);
        throw error;
      }

      const reportButton = new ButtonBuilder()
        .setCustomId(`report-confession:${message.id}`)
        .setLabel('Report')
        .setStyle(ButtonStyle.Danger);

      const row = new ActionRowBuilder<ButtonBuilder>().addComponents(reportButton);

      try {
        await message.edit({ components: [row] });
        await storeConfessionContext({
          guildId: interaction.guild.id,
          channelId: confessionChannel.id,
          messageId: message.id,
          threadId: thread.id
        });
      } catch (error) {
        await thread.delete().catch(() => null);
        await message.delete().catch(() => null);
        throw error;
      }

      await modalSubmit.reply({
        content: `${emojis.rightArrow2} Confession sent.`,
        flags: MessageFlags.Ephemeral
      });
      return;
    }

    const parsed = parseConfessionButton(interaction.customId);

    if (parsed.action === 'report-confession') {
      if (!interaction.inGuild() || !interaction.guild || !parsed.messageId) {
        await interaction.reply({
          content: `${emojis.rightArrow2} This confession cannot be reported right now.`,
          flags: MessageFlags.Ephemeral
        });
        return;
      }

      const context = await getConfessionContext(parsed.messageId);

      if (!context) {
        await interaction.reply({
          content: `${emojis.rightArrow2} This confession is no longer available.`,
          flags: MessageFlags.Ephemeral
        });
        return;
      }

      const moderators = getModeratorIds();

      if (moderators.length === 0) {
        await interaction.reply({
          content: `${emojis.rightArrow2} No bot moderators are configured.`,
          flags: MessageFlags.Ephemeral
        });
        return;
      }

      const reasonInput = new TextInputBuilder()
        .setCustomId('confession-report-reason')
        .setStyle(TextInputStyle.Paragraph)
        .setRequired(true)
        .setMaxLength(1_000);

      const reasonLabel = new LabelBuilder().setLabel('Reason').setTextInputComponent(reasonInput);

      const modal = new ModalBuilder()
        .setCustomId(`report-confession-modal:${parsed.messageId}`)
        .setTitle('Report Confession')
        .addLabelComponents(reasonLabel);

      await interaction.showModal(modal);

      let modalSubmit;

      try {
        modalSubmit = await interaction.awaitModalSubmit({
          filter: (modalInteraction) =>
            modalInteraction.customId === `report-confession-modal:${parsed.messageId}` &&
            modalInteraction.user.id === interaction.user.id,
          time: 60_000
        });
      } catch {
        return;
      }

      const reason = modalSubmit.fields.getTextInputValue('confession-report-reason');
      await modalSubmit.deferReply({ flags: MessageFlags.Ephemeral });
      const channel = await interaction.client.channels.fetch(context.channelId).catch(() => null);

      if (!(channel instanceof TextChannel)) {
        await modalSubmit.editReply({
          content: `${emojis.rightArrow2} The confession channel is no longer available.`
        });
        return;
      }

      const message = await channel.messages.fetch(context.messageId).catch(() => null);

      if (!message) {
        await modalSubmit.editReply({
          content: `${emojis.rightArrow2} That confession no longer exists.`
        });
        return;
      }

      const deleteButton = new ButtonBuilder()
        .setCustomId(`delete-confession:${context.guildId}:${context.channelId}:${context.messageId}`)
        .setLabel('Delete Confession')
        .setStyle(ButtonStyle.Danger);

      const row = new ActionRowBuilder<ButtonBuilder>().addComponents(deleteButton);
      const confessionText = message.embeds[0]?.description ?? 'No confession content was found.';
      const link = buildConfessionLink(context.guildId, context.channelId, context.messageId);

      const reportEmbed = new EmbedBuilder()
        .setTitle('Confession Reported')
        .addFields(
          { name: 'Guild', value: `${interaction.guild.name} (${interaction.guild.id})` },
          { name: 'Channel', value: `<#${context.channelId}>` },
          { name: 'Reported by', value: `${modalSubmit.user.tag} (${modalSubmit.user.id})` },
          { name: 'Reason', value: reason },
          { name: 'Confession', value: confessionText.slice(0, 1024) },
          { name: 'Link', value: link }
        )
        .setTimestamp();

      const deliveries = await Promise.allSettled(
        moderators.map(async (moderatorId) => {
          const user = await interaction.client.users.fetch(moderatorId);
          await user.send({ embeds: [reportEmbed], components: [row] });
        })
      );

      const delivered = deliveries.some((result) => result.status === 'fulfilled');

      if (!delivered) {
        await modalSubmit.reply({
          content: `${emojis.rightArrow2} I could not contact any configured moderators.`,
          flags: MessageFlags.Ephemeral
        });
        return;
      }

      await modalSubmit.reply({
        content: `${emojis.rightArrow2} Your report was sent to the bot moderators.`,
        flags: MessageFlags.Ephemeral
      });
      return;
    }

    if (parsed.action === 'delete-confession') {
      if (interaction.inGuild() || !parsed.messageId) {
        await interaction.reply({
          content: `${emojis.rightArrow2} This action can only be used from a moderator DM.`
        });
        return;
      }

      const context = parsed.guildId && parsed.channelId && parsed.messageId
        ? {
            guildId: parsed.guildId,
            channelId: parsed.channelId,
            messageId: parsed.messageId,
            threadId: ''
          }
        : await getConfessionContext(parsed.messageId);

      if (!context) {
        await interaction.reply({
          content: `${emojis.rightArrow2} This confession is no longer available.`
        });
        return;
      }

      const moderatorIds = getModeratorIds();

      if (!moderatorIds.includes(interaction.user.id)) {
        await interaction.reply({
          content: `${emojis.rightArrow2} You are not configured as a bot moderator.`
        });
        return;
      }

      const channel = await interaction.client.channels.fetch(context.channelId).catch(() => null);

      if (!(channel instanceof TextChannel)) {
        await interaction.reply({
          content: `${emojis.rightArrow2} The confession channel is no longer available.`
        });
        return;
      }

      const message = await channel.messages.fetch(context.messageId).catch(() => null);

      if (!message) {
        await interaction.reply({
          content: `${emojis.rightArrow2} That confession no longer exists.`
        });
        return;
      }

      const deletedEmbed = new EmbedBuilder()
        .setTitle('Confession')
        .setDescription('This confession was deleted by moderators.')
        .setColor(0xed4245)
        .setTimestamp();

      try {
        await message.edit({ embeds: [deletedEmbed], components: [] });
      } catch {
        await interaction.reply({
          content: `${emojis.rightArrow2} I could not update the confession message.`
        });
        return;
      }

      await removeConfessionContext(context.messageId);

      await interaction.reply({
        content: `${emojis.rightArrow2} Confession marked as deleted.`
      });
    }
  }
}