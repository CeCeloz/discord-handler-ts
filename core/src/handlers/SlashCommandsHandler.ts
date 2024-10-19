import {Client, Collection, CommandInteraction, Events, REST, Routes} from "discord.js";
import fs from "fs";
import path from "path";
import {fileURLToPath, pathToFileURL} from "url";
import {SlashCommand} from "../models/SlashCommand.js";
import {Event} from "../models/Event.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const slashCommands: Collection<String, any> = new Collection();
const rest = new REST().setToken(process.env.BOT_TOKEN as string);

async function slashCommandsEvent(client: Client) {
    const event: Event = {
        name: "slashCommandInteraction",
        eventType: Events.InteractionCreate,
        once: false,
        execute: async (interaction: CommandInteraction) => {
            if (!interaction.isChatInputCommand()) return

            const slashCommand: SlashCommand = slashCommands.get(interaction.commandName);

            if (!slashCommand) return;

            try {
                await slashCommand.execute(interaction);
            } catch (error) {
                console.error(`Failed to execute slash command ${interaction.commandName}:`, error);
            }
        }
    }

    client.on(event.eventType, (...args) => event.execute(...args));
}

export async function loadSlashCommands(client: Client, directory: string) {
    slashCommandsEvent(client);
    const slashCommandsPath = path.resolve(__dirname, directory);
    const files = fs.readdirSync(slashCommandsPath, {recursive: true})
    const tsFiles = files.map(file => file.toString()).filter(file => file.endsWith('.ts'));

    for (const file of tsFiles) {
        try {
            const fileUrl = pathToFileURL(path.join(slashCommandsPath, file)).href;
            const slashCommandModule = await import(fileUrl);
            for (const key in slashCommandModule) {
                const slashCommand = slashCommandModule[key];

                if (!slashCommand.data || !slashCommand.execute) {
                    console.warn(`Slash command at ${file} is missing required properties.`);
                    continue;
                }

                slashCommands.set(slashCommand.data.name, slashCommand);

                const jsonCommands = slashCommands.map(cmd => cmd.data.toJSON());

                if (slashCommand.registrationType === "guild") {
                    rest.put(
                        Routes.applicationGuildCommands(process.env.CLIENT_ID as string, process.env.GUILD_ID as string),
                        {body: jsonCommands},
                    )
                }

                rest.put(
                    Routes.applicationCommands(process.env.CLIENT_ID as string),
                    {body: jsonCommands},
                )

                console.log(`Loaded slash command: ${slashCommand.data.name}`);

            }
        } catch (error) {
            console.error(`Failed to load slash command ${file}:`, error);
        }
    }
}