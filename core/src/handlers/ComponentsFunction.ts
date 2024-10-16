import {Client, Collection, Events, Interaction} from "discord.js";
import {existsSync, readdirSync} from "fs";
import {Event} from "../models/Event.js";
import {fileURLToPath, pathToFileURL} from 'url';
import {dirname, join} from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const componentsCollection: Collection<String, any> = new Collection();

export async function deployComponents() {
    const componentsPath = join(__dirname, '../../../bot/src/components');

    if (!existsSync(componentsPath)) {
        console.warn(`The directory ${componentsPath} does not exist.`);
        return;
    }

    const componentsFolder = readdirSync(componentsPath);

    for (const file of componentsFolder) {
        try {
            const componentsModulePath = pathToFileURL(join(componentsPath, file)).href;
            const componentsModules = await import(componentsModulePath);
            const component = componentsModules.default || componentsModules;

            if ("customId" in component && "execute" in component) {
                componentsCollection.set(component.customId, component);
            } else {
                console.log(`[WARNING] The component at ${file} is missing a required "customId" or "execute" property.`);
            }

            console.log(`Component ${file} has been loaded`);
        } catch (error) {
            console.error(`Error loading component ${file}:`, error);
        }
    }
}

const handlerInteraction: Event = {
    name: "handlerInteraction",
    eventType: Events.InteractionCreate,
    once: false,
    execute: async (interaction: Interaction): Promise<void> => {
        if (interaction.isButton() || interaction.isStringSelectMenu() || interaction.isModalSubmit()) {
            const component = componentsCollection.get(interaction.customId);

            if (!component) return;

            try {
                await component.execute(interaction);
            } catch (error) {
                console.error(error);
            }
        }
    }
};

export async function deployComponentsInteractionHandler(client: Client): Promise<void> {
    client.on(handlerInteraction.eventType, (...args: any[]) => handlerInteraction.execute(...args));
}

// Example of a component (e.g., button) module structure
/**
 * File: example-button.ts
 * This is an example of a component (e.g., button) that replies when interacted with.
 *
 * export default {
 *     customId: 'example-button',
 *     execute: async (interaction: ButtonInteraction) => {
 *         await interaction.reply({ content: 'Button clicked!' });
 *     }
 * };
 */

