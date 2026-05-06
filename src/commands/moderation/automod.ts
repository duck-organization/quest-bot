import { Command } from '@sapphire/framework';
import { MessageFlags } from 'discord.js';
import { createAutoMod, DuplicateAutoModError, getAutoMod, getAutoMods, removeAutoMod } from '#lib/automod.js';
import { LimitError } from '#lib/limits.js';
import { emojis } from '#utils/emoji.js';

export class AutoModCommand extends Command {
  public constructor(context: Command.LoaderContext, options: Command.Options) {
    super(context, { ...options });
  }

  public override registerApplicationCommands(registry: Command.Registry) {
    registry.registerChatInputCommand((builder) =>
      builder
        .setName('automod')
        .setDescription('Block words from being said!')
        .addSubcommand((sub) =>
          sub
            .setName('add')
            .setDescription('Create a new automod rule.')
            .addStringOption((option) =>
              option.setName('word').setDescription('The word to block').setRequired(true)
            )
        )
        .addSubcommand((sub) =>
          sub
            .setName('remove')
            .setDescription('Remove words from the automod list.')
            .addStringOption((option) =>
              option
                .setName('word')
                .setDescription('The word to remove')
                .setAutocomplete(true)
                .setRequired(true)
            )
        )
        .addSubcommand((sub) =>
            sub
                .setName('list')
                .setDescription('List all blocked words.')
        )
    );
  }

  public override async autocompleteRun(interaction: Command.AutocompleteInteraction) {
    if (!interaction.guildId) {
      await interaction.respond([]);
      return;
    }

    const focusedOption = interaction.options.getFocused(true);

    if (interaction.options.getSubcommand() !== 'remove' || focusedOption.name !== 'word') {
      await interaction.respond([]);
      return;
    }

    const autoMods = await getAutoMods(interaction.guildId);
    const choices = autoMods.slice(0, 25).map((autoMod) => ({
      name: autoMod.word,
      value: autoMod.id
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
      const word = interaction.options.getString('word', true).trim().toLowerCase();
      try {
        await createAutoMod(interaction.guildId, interaction.guild.name, word);
        await interaction.reply({
          content: `${emojis.rightArrow2} The word '${word}' has been added to the automod list.`,
          flags: MessageFlags.Ephemeral
        });
      } catch (err) {
        if (err instanceof LimitError) {
          await interaction.reply({
            content: `${emojis.rightArrow2} ${err.message}`,
            flags: MessageFlags.Ephemeral
          });
          return;
        }

        if (err instanceof DuplicateAutoModError) {
          await interaction.reply({
            content: `${emojis.rightArrow2} ${err.message}`,
            flags: MessageFlags.Ephemeral
          });
          return;
        }

        console.error(err);

        await interaction.reply({
          content: `${emojis.rightArrow2} That word is already blocked in this server.`,
          flags: MessageFlags.Ephemeral
        });
      }
    }

    if (subcommand === 'list') {
      const autoMods = await getAutoMods(interaction.guildId);
      if (autoMods.length === 0) {
        await interaction.reply({
          content: `${emojis.rightArrow2} There are no words in the automod list.`,
          flags: MessageFlags.Ephemeral
        });
        return;
      }

      const wordList = autoMods.map((autoMod) => `${emojis.rightArrow1} ${autoMod.word}`).join('\n');
      await interaction.reply({
        content: `**Blocked Words:**\n${wordList}`,
        flags: MessageFlags.Ephemeral
      });
    }

    if (subcommand === 'remove') {
      const autoModId = interaction.options.getString('word', true);
      const autoMod = await getAutoMod(autoModId);

      if (!autoMod) {
        await interaction.reply({
          content: `${emojis.rightArrow2} That blocked word doesn't exist.`,
          flags: MessageFlags.Ephemeral
        });
        return;
      }

      await removeAutoMod(autoMod.id);
      await interaction.reply({
        content: `${emojis.rightArrow2} The word '${autoMod.word}' has been removed from the automod list.`,
        flags: MessageFlags.Ephemeral
      });
    }
  }
}