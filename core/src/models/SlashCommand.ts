import {CommandInteraction, InteractionResponse, SlashCommandBuilder} from "discord.js";

export default abstract class SlashCommand {
    public static data: SlashCommandBuilder;
    public static registrationType: "guild" | "global";

    abstract execute(interaction: CommandInteraction): void | Promise<void | InteractionResponse<boolean>>;
}
