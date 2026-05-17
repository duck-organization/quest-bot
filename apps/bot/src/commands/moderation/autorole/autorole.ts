import { Command } from '@sapphire/framework';
import { MessageFlags, PermissionFlagsBits } from 'discord.js';
import { createAutoRole, getAutoRole, getAutoRoles, removeAutoRole } from '#lib/autorole.js';
import { getQuestUnlimitedPurchaseComponents, LimitError } from '#lib/limits.js';
import { emojis } from '#utils/emoji.js';

export class AutoRoleCommand extends Command {
  public constructor(context: Command.LoaderContext, options: Command.Options) {
    super(context, { ...options, preconditions: ['devMode'] });
  }

  public override registerApplicationCommands(registry: Command.Registry) {
    registry.registerChatInputCommand((builder: any) =>
      builder
        .setName('autorole')
        .setDescription('Automatically assign roles to new members!')
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageRoles)
        .addSubcommand((sub: any) =>
          sub
            .setName('add')
            .setDescription('Create a new auto role.')
            .addRoleOption((option: any) =>
              option.setName('role').setDescription('The role to assign to new members').setRequired(true)
            )
            .addBooleanOption((option: any) =>
              option.setName('bot_role').setDescription('Whether this role should be assigned to bots').setRequired(true)
            )
        )
        .addSubcommand((sub: any) =>
          sub
            .setName('remove')
            .setDescription('Remove an auto role.')
            .addStringOption((option: any) =>
              option
                .setName('role')
                .setDescription('The auto role to remove')
                .setAutocomplete(true)
                .setRequired(true)
            )
        )
        .addSubcommand((sub: any) =>
            sub
                .setName('list')
                .setDescription('List all auto roles.')
        )
    );
  }

  public override async autocompleteRun(interaction: Command.AutocompleteInteraction) {
    if (!interaction.guildId) {
      await interaction.respond([]);
      return;
    }

    const focusedOption = interaction.options.getFocused(true);

    if (interaction.options.getSubcommand() !== 'remove' || focusedOption.name !== 'role') {
      await interaction.respond([]);
      return;
    }

    const autoRoles = await getAutoRoles(interaction.guildId);
    const choices = autoRoles.slice(0, 25).map((autoRole) => ({
      name: interaction.guild?.roles.cache.get(autoRole.roleId)?.name ?? autoRole.roleId,
      value: autoRole.id
    }));

    await interaction.respond(choices);
  }

  public override async chatInputRun(interaction: Command.ChatInputCommandInteraction) {
    if (!interaction.inCachedGuild()) {
      await interaction.reply({
        content: `${emojis.rightArrow2} This command can only be used in a server.`,
        flags: MessageFlags.Ephemeral
      });
      return;
    }

    const subcommand = interaction.options.getSubcommand();

    if (subcommand === 'add') {
      const role = interaction.options.getRole('role', true);
      const botRole = interaction.options.getBoolean('bot_role', true);

      if (!interaction.member.permissions.has(PermissionFlagsBits.ManageRoles)) {
        await interaction.reply({
          content: `${emojis.rightArrow2} You do not have permission to configure auto roles.`,
          flags: MessageFlags.Ephemeral
        });
        return;
      }

      if (interaction.member.roles.highest.position <= role.position) {
        await interaction.reply({
          content: `${emojis.rightArrow2} You can only configure auto roles for roles below your highest role.`,
          flags: MessageFlags.Ephemeral
        });
        return;
      }

      try {
        await createAutoRole(
          interaction.guildId,
          interaction.guild.name,
          role.id,
          botRole,
          interaction.client.application.entitlements
        );
        await interaction.reply({
          content: `${emojis.rightArrow2} Added auto role ${role} (Bot Role: ${botRole}).`,
          flags: MessageFlags.Ephemeral
        });
      } catch (err) {
        if (err instanceof LimitError) {
          if (err.showQuestUnlimitedPrompt) {
            await interaction.reply({
              content: `${emojis.questUnlimited2} ${err.message} Unlock unlimited auto roles with QuestUnlimited.`,
              components: getQuestUnlimitedPurchaseComponents(interaction.client.application.id),
              flags: MessageFlags.Ephemeral
            });
            return;
          }

          await interaction.reply({
            content: `${emojis.rightArrow2} ${err.message}`,
            flags: MessageFlags.Ephemeral
          });
          return;
        }

        console.error(err);

        await interaction.reply({
          content: `${emojis.rightArrow2} That role is already an auto role in this server.`,
          flags: MessageFlags.Ephemeral
        });
      }
    }

    if (subcommand === 'remove') {
      const autoRoleId = interaction.options.getString('role', true);
      const autoRole = await getAutoRole(autoRoleId);

      if (!autoRole || autoRole.guildId !== interaction.guildId) {
        await interaction.reply({
          content: `${emojis.rightArrow2} That auto role no longer exists.`,
          flags: MessageFlags.Ephemeral
        });
        return;
      }

      await removeAutoRole(autoRole.id);
      await interaction.reply({
        content: `${emojis.rightArrow2} Removed auto role for <@&${autoRole.roleId}>.`,
        flags: MessageFlags.Ephemeral
      });
    }

    if (subcommand === 'list') {
        const autoRoles = await getAutoRoles(interaction.guildId);
        if (autoRoles.length === 0) {
            await interaction.reply({
                content: `${emojis.rightArrow2} There are no auto roles set up in this server.`,
                flags: MessageFlags.Ephemeral
            });
            return;
        }

        const autoRoleList = autoRoles.map(autoRole => {
            const role = interaction.guild?.roles.cache.get(autoRole.roleId);
            const roleName = role ? `<@&${role.id}>` : `Unknown Role (${autoRole.roleId})`;
            const botRoleText = autoRole.botRole ? ' (Bot Role)' : '';
            return `${emojis.rightArrow1} ${roleName}${botRoleText}`;
        }).join('\n');

        await interaction.reply({
            content: `**Auto Roles:**\n${autoRoleList}`,
            flags: MessageFlags.Ephemeral
        });
    }
  }
}