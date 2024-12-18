import SlashCommand from "../../../core/src/models/SlashCommand.js";
import {ChatInputCommandInteraction, PermissionFlagsBits, SlashCommandBuilder} from "discord.js";

export default class TestCommand extends SlashCommand {
    public static data: SlashCommandBuilder = <SlashCommandBuilder>new SlashCommandBuilder()
        .setName('test')
        .setDescription('test')
        .setDescriptionLocalizations({"pt-BR": "Todos os comandos de staff"})
        .setDefaultMemberPermissions(PermissionFlagsBits.SendPolls)


    public static registrationType: "guild" | "global" = "global";

    async execute(interaction: ChatInputCommandInteraction): Promise<void> {

    }
}