import {Client, Collection, Events, Interaction, REST, Routes} from "discord.js";
import {readdirSync} from "fs";
import {Event} from "../models/Event.js";

const rest: REST = new REST().setToken(process.env.BOT_TOKEN as string);
const commands: any[] = []
const commandsCollection: Collection<String, any> = new Collection();

export async function deployCommands() {

    const commandsFolder = readdirSync("./src/commands").filter((file) => file.endsWith(".ts"));

    for (const file of commandsFolder) {
        try {
            const commandModule = await import(`../commands/${file}`);
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
                command.execute(interaction);
            } catch (error) {
                console.error(error)
            }
        }
    }
}

export async function deployHandlerInteraction(client: Client): Promise<void> {
    client.on(handlerInteraction.eventType, (...args: any[]) => handlerInteraction.execute(...args));
}
