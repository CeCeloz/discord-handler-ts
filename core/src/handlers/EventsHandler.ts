/**
 * File: ready.ts
 * This is an example event that will be executed when the bot is ready.
 *
 * export default const readyEvent: Event = {
 *     name: "ready",
 *     eventType: Events.ClientReady,
 *     once: true, // Will be executed only once
 *     execute: () => {
 *         console.log("Bot is online and ready to use!");
 *     }
 * };
 *
 */
import {Client} from "discord.js";
import fs from "fs";
import path from "path";
import {fileURLToPath, pathToFileURL} from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export async function loadEvents(client: Client, eventsDirectory: string) {
    const eventsPath = path.resolve(__dirname, eventsDirectory);
    const files = fs.readdirSync(eventsPath, {recursive: true})

    const tsFiles = files.map(file => file.toString()).filter(file => file.endsWith('.ts'));

    for (const file of tsFiles) {
        try {
            const fileUrl = pathToFileURL(path.join(eventsPath, file)).href;
            const eventModule = await import(fileUrl);
            for (const key in eventModule) {
                const event = eventModule[key];

                if (!event.name || !event.eventType || !event.execute) {
                    console.warn(`Event at ${file} is missing required properties.`);
                    continue;
                }

                if (event.once) {
                    client.once(event.eventType, (...args) => event.execute(...args));
                } else {
                    client.on(event.eventType, (...args) => event.execute(...args));
                }

                console.log(`Loaded event: ${event.name}`);
            }
        } catch (error) {
            console.error(`Failed to load event ${file}:`, error);
        }
    }
}
