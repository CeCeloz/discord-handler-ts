import {Client, ClientEvents, Collection, Events, Interaction, MessageComponentInteraction} from "discord.js";
import fs from "fs";
import path from "path";
import {fileURLToPath, pathToFileURL} from "url";
import Event from "../models/Event.js";
import Components from "../models/Component.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const components: Collection<String, Components> = new Collection();

class ComponentsEvent extends Event {
    name = "componentsInteraction";
    eventType: keyof ClientEvents = Events.InteractionCreate;
    once = false;

    async execute(interaction: MessageComponentInteraction) {
        if (interaction.isButton() || interaction.isAnySelectMenu() || interaction.isModalSubmit()) {

            const messageComponent = components.find((component) => interaction.customId.includes(component.customId!));

            if (!messageComponent) return;

            try {
                await messageComponent.execute(interaction);
            } catch (error) {
                console.error(`Failed to execute slash command ${interaction}:`, error);
            }
        }
    }
}

async function componentsEvent(client: Client) {
    client.on(Events.InteractionCreate, (interaction: Interaction) => {
        new ComponentsEvent().execute(interaction as MessageComponentInteraction);
    });
}

export async function loadComponents(client: Client, directory: string) {
    await componentsEvent(client);

    const componentsPath = path.resolve(__dirname, directory);
    const files = fs.readdirSync(componentsPath, {recursive: true});
    const tsFiles = files.map(file => file.toString()).filter(file => file.endsWith(".ts") || file.endsWith(".js"));

    for (const file of tsFiles) {
        try {
            const fileUrl = pathToFileURL(path.join(componentsPath, file)).href;
            const componentsModule = await import(fileUrl);

            for (const key in componentsModule) {
                const component = componentsModule[key];

                if (!(typeof component === 'function' && !!component.prototype && component.prototype.constructor === component)) continue;

                const componentInstance = new component();

                if (!componentInstance.customId || !componentInstance.execute) continue;

                components.set(componentInstance.customId, componentInstance);

                console.log(`Loaded component: ${componentInstance.customId}`);
            }

        } catch (error) {
            console.error(`Failed to load component ${file}:`, error);
        }
    }
}
