import {Client} from "discord.js";
import {readdirSync} from "fs";
import {Event} from "../models/Event.js";

export async function deployEvents(client: Client): Promise<void> {
    const eventsFolder: string[] = readdirSync("./src/events").filter((file: string) => file.endsWith(".ts"));

    for (const file of eventsFolder) {
        try {
            const eventModule = await import(`../events/${file}`);
            const event: Event = eventModule.default || eventModule;

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
