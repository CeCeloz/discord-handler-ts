import {SlashCommand} from "../../../core/src/models/SlashCommand.js";
import {CommandInteraction, PermissionFlagsBits, SlashCommandBuilder} from "discord.js";

const testCommand: SlashCommand = {
    data: new SlashCommandBuilder()
        .setName('test')
        .setDescription('Test command')
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages),
    registrationType: 'global',
    async execute(interaction: CommandInteraction) {
        console.log("test")
    }
}

export default testCommand;