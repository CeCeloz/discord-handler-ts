import {Client} from "discord.js";
import {readdirSync} from "fs";
import {Event} from "../models/Event.js";

module.exports = async (client: Client) => {
    const eventsFolder = readdirSync("./src/events").filter((file) => file.endsWith(".ts"));

    for (const file of eventsFolder) {
        try {
            const eventModule = await import(`../events/${file}`);
            const event: Event = eventModule.default || eventModule;

            if (event.once) {
                client.once(event.eventType, (...args) => event.execute(...args));
            } else {
                client.on(event.eventType, (...args) => event.execute(...args));
            }

            console.log(`Event ${event.eventType} loaded`);
        } catch (error) {
            console.error(`Error loading event ${file}:`, error);
        }
    }
};
