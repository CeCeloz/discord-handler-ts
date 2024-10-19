import {Client, Collection, Events} from "discord.js";
import fs from "fs";
import path from "path";
import {fileURLToPath, pathToFileURL} from "url";
import {Component} from "../models/Component.js";
import {Event} from "../models/Event.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const components: Collection<String, any> = new Collection();

async function componentsEvent(client: Client) {
    const event: Event = {
        name: "componentsInteraction",
        eventType: Events.InteractionCreate,
        once: false,
        execute: async (interaction) => {
            if (interaction.isButton() || interaction.isAnySelectMenu() || interaction.isModalSubmit()) {

                const component: Component = components.get(interaction.customId);

                if (!component) return;

                try {
                    await component.execute(interaction);
                } catch (error) {
                    console.error(`Failed to execute slash command ${interaction.commandName}:`, error);
                }
            }
        }
    }

    client.on(event.eventType, (...args) => event.execute(...args));
}

export async function loadComponents(client: Client, directory: string) {
    componentsEvent(client);
    const componentsPath = path.resolve(__dirname, directory);
    const files = fs.readdirSync(componentsPath, {recursive: true})
    const tsFiles = files.map(file => file.toString()).filter(file => file.endsWith('.ts'));

    for (const file of tsFiles) {
        try {
            const fileUrl = pathToFileURL(path.join(componentsPath, file)).href;
            const componentsModule = await import(fileUrl);

            for (const key in componentsModule) {
                const component = componentsModule[key];
                if (!component.customId || !component.execute) {
                    console.warn(`Component at ${file} is missing required properties.`);
                    continue;
                }

                components.set(component.customId, component);
                console.log(`Loaded component: ${component.customId}`);
            }

        } catch (error) {
            console.error(`Failed to load slash command ${file}:`, error);
        }
    }
}