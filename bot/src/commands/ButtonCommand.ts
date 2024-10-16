import {
    ActionRowBuilder,
    CommandInteraction,
    ModalBuilder, PermissionFlagsBits,
    SlashCommandBuilder,
    TextInputBuilder,
    TextInputStyle
} from 'discord.js';

export const data = new SlashCommandBuilder()
    .setName('test')
    .setDescription('test')
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages)

export async function execute(interaction: CommandInteraction): Promise<void> {
    const modal = new ModalBuilder()
        .setCustomId('test')
        .setTitle('Test')

    const suggestion = new TextInputBuilder()
        .setCustomId('test')
        .setLabel('Test')
        .setPlaceholder('Test')
        .setRequired(true)
        .setStyle(TextInputStyle.Short)

    const firstActionRow = new ActionRowBuilder<TextInputBuilder>().addComponents(suggestion)

    modal.addComponents(firstActionRow);

    await interaction.showModal(modal);
}