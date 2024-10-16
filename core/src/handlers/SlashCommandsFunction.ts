import {Client, Collection, Events, Interaction, REST, Routes} from 'discord.js';
import {existsSync, readdirSync} from 'fs';
import {fileURLToPath, pathToFileURL} from 'url';
import {dirname, join} from 'path';
import {Event} from '../models/Event.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const rest: REST = new REST().setToken(process.env.BOT_TOKEN as string);
const commands: any[] = []
const commandsCollection: Collection<String, any> = new Collection();

export async function deploySlashCommands() {
    const commandsPath = join(__dirname, '../../../bot/src/commands');

    if (!existsSync(commandsPath)) {
        console.warn(`The directory ${commandsPath} does not exist.`);
        return;
    }

    const commandsFolder = readdirSync(commandsPath);

    for (const file of commandsFolder) {
        try {
            const commandsModulePath = pathToFileURL(join(commandsPath, file)).href;
            const commandModule = await import(commandsModulePath);
            const command = commandModule.default || commandModule;

            if ('data' in command && 'execute' in command) {
                commands.push(command.data.toJSON());
                commandsCollection.set(command.data.name, command);
            } else {
                console.log(`[WARNING] The command at ${file} is missing a required "data" or "execute" property.`);
            }

            await rest.put(
                Routes.applicationCommands(process.env.CLIENT_ID as string),
                {body: commands},
            );

            console.log(`SlashCommand ${file} has been loaded`)

        } catch (error) {
            console.error(`Error loading command ${file}:`, error);
        }
    }

}

const handlerInteraction: Event = {
    name: "handlerInteraction",
    eventType: Events.InteractionCreate,
    once: false,
    execute: async (interaction: Interaction): Promise<void> => {
        if (interaction.isChatInputCommand()) {
            const command = commandsCollection.get(interaction.commandName);

            if (!command) return

            try {
                await command.execute(interaction);
            } catch (error) {
                console.error(error)
            }
        }
    }
}

export async function deploySlashCommandsInteractionHandler(client: Client): Promise<void> {
    client.on(handlerInteraction.eventType, (...args: any[]) => handlerInteraction.execute(...args));
}

// Example of a slash command: "ping.ts"
/**
 * File: ping.ts
 * This is an example of a slash command that replies with "Pong!" when executed.
 *
 * import { SlashCommandBuilder } from "discord.js";
 *
 * const pingCommand = {
 *     data: new SlashCommandBuilder()
 *         .setName("ping")
 *         .setDescription("Replies with Pong!"),
 *     execute: async (interaction) => {
 *         await interaction.reply("Pong!");
 *     }
 * };
 *
 * export default pingCommand;
 */