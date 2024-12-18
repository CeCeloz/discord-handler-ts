import {Client} from "discord.js";
import fs from "fs";
import path from "path";
import {fileURLToPath, pathToFileURL} from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export async function loadEvents(client: Client, eventsDirectory: string) {
    const eventsPath = path.resolve(__dirname, eventsDirectory);
    const files = fs.readdirSync(eventsPath, {recursive: true})

    const tsFiles = files.map(file => file.toString()).filter(file => file.endsWith(".ts") || file.endsWith(".js"));

    for (const file of tsFiles) {
        try {
            const fileUrl = pathToFileURL(path.join(eventsPath, file)).href;
            const eventModule = await import(fileUrl);

            for (const key in eventModule) {
                const event = eventModule[key];

                const eventInstance = new event();

                if (eventInstance.once) {
                    client.once(eventInstance.eventType, (...args) => eventInstance.execute(...args));
                } else {
                    client.on(eventInstance.eventType, (...args) => eventInstance.execute(...args));
                }

                console.log(`Loaded event: ${eventInstance.name}`);
            }
        } catch (error) {
            console.error(`Failed to load event ${file}:`, error);
        }
    }
}
