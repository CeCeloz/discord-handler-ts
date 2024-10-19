import { CommandInteraction, SlashCommandBuilder } from 'discord.js';

export interface SlashCommand {
    data: SlashCommandBuilder;
    registrationType: 'guild' | 'global';
    execute(interaction: CommandInteraction): Promise<void>;
}
