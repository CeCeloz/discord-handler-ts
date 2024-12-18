import {
    ChatInputCommandInteraction,
    Client,
    ClientEvents,
    Collection,
    Events, Interaction,
    REST, Routes, RESTPostAPIChatInputApplicationCommandsJSONBody
} from "discord.js";
import fs from "fs";
import path from "path";
import {fileURLToPath, pathToFileURL} from "url";
import Event from "../models/Event.js";
import SlashCommand from "../models/SlashCommand.js";

const slashCommands: Collection<String, SlashCommand> = new Collection();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rest = new REST().setToken(process.env.BOT_TOKEN as string);

class SlashCommandsEvent extends Event {
    name = "slashCommandsInteractions";
    eventType: keyof ClientEvents = Events.InteractionCreate;
    once = false;

    async execute(interaction: ChatInputCommandInteraction) {
        const slashCommand = slashCommands.get(interaction.commandName);

        if (!slashCommand) return;

        try {
            await slashCommand.execute(interaction);
        } catch (error) {
            console.error(`Failed to execute slash command ${interaction}:`, error);
        }
    }
}

async function componentsEvent(client: Client) {
    client.on(Events.InteractionCreate, (interaction: Interaction) => {
        if (interaction.isChatInputCommand()) new SlashCommandsEvent().execute(interaction as ChatInputCommandInteraction);
    });
}

export async function loadSlashCommands(client: Client, directory: string) {
    await componentsEvent(client);

    const slashCommandsPath = path.resolve(__dirname, directory);
    const files = fs.readdirSync(slashCommandsPath, {recursive: true})
    const tsFiles = files.map(file => file.toString()).filter(file => file.endsWith(".ts") || file.endsWith(".js"));

    const globalCommands: RESTPostAPIChatInputApplicationCommandsJSONBody[] = [];
    const guildCommands: RESTPostAPIChatInputApplicationCommandsJSONBody[] = [];

    for (const file of tsFiles) {
        try {
            const fileUrl = pathToFileURL(path.join(slashCommandsPath, file)).href;
            const slashCommandModule = await import(fileUrl);

            const SlashCommandClass = slashCommandModule.default;

            if (Object.getPrototypeOf(SlashCommandClass) === SlashCommand) {
                const slashCommandInstance = new SlashCommandClass();

                slashCommands.set(SlashCommandClass.data.name, slashCommandInstance);

                if (SlashCommandClass.registrationType === "guild") {
                    guildCommands.push(SlashCommandClass.data.toJSON());
                } else {
                    globalCommands.push(SlashCommandClass.data.toJSON());
                }

                console.log(`Loaded SlashCommand: ${SlashCommandClass.data.name}`);
            } else {
                console.warn(`File ${file} does not export a valid SlashCommand.`);
            }
        } catch (error) {
            console.error(`Failed to load SlashCommand from file ${file}:`, error);
        }
    }

    if (globalCommands.length > 0) {
        try {
            await rest.put(
                Routes.applicationCommands(process.env.CLIENT_ID as string),
                {body: globalCommands},
            );
        } catch (error) {
            console.error("Failed to register global commands:", error);
        }
    }

    if (guildCommands.length > 0) {
        try {
            await rest.put(
                Routes.applicationGuildCommands(
                    process.env.CLIENT_ID as string,
                    process.env.GUILD_ID as string
                ),
                {body: guildCommands},
            );
        } catch (error) {
            console.error("Failed to register guild commands:", error);
        }
    }
}
