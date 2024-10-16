import {Client} from "discord.js";
import {existsSync, readdirSync} from "fs";
import {Event} from "../models/Event.js";
import {fileURLToPath, pathToFileURL} from 'url';
import {dirname, join} from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export async function deployEvents(client: Client): Promise<void> {
    const eventsPath = join(__dirname, '../../../bot/src/events');

    if (!existsSync(eventsPath)) {
        console.warn(`The directory ${eventsPath} does not exist.`);
        return;
    }

    const eventsFolder = readdirSync(eventsPath);

    for (const file of eventsFolder) {
        try {
            const eventsModulePath = pathToFileURL(join(eventsPath, file)).href;
            const eventsModule = await import(eventsModulePath);
            const event: Event = eventsModule.default || eventsModule;

            if (event.once) {
                client.once(event.eventType, (...args: any[]) => event.execute(...args));
            } else {
                client.on(event.eventType, (...args: any[]) => event.execute(...args));
            }

            console.log(`Event ${event.name} loaded`);
        } catch (error) {
            console.error(`Error loading event ${file}:`, error);
        }
    }
}


// Example event: "ready.ts"
/**
 * File: ready.ts
 * This is an example event that will be executed when the bot is ready.
 *
 * import { Event } from "../models/Event";
 *
 * const readyEvent: Event = {
 *     name: "ready",
 *     eventType: "ready",
 *     once: true, // Will be executed only once
 *     execute: () => {
 *         console.log("Bot is online and ready to use!");
 *     }
 * };
 *
 * export default readyEvent;
 */