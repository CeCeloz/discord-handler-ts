import {Client} from 'discord.js';
import {readdirSync} from 'fs';
import * as console from 'node:console';
import {fileURLToPath, pathToFileURL} from 'url';
import {dirname, join} from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const handlersPath = join(__dirname, 'handlers');
const handlersFolder = readdirSync(handlersPath);

async function loadHandlers(client: Client, handlersFolder: string[]) {

    for (const file of handlersFolder) {
        try {
            const modulePath = pathToFileURL(join(handlersPath, file)).href;
            const module = await import(modulePath);
            for (const [key, func] of Object.entries(module)) {
                if (typeof func === 'function') {
                    func(client);
                    console.log(`Handler ${key} from ${file} loaded`);
                }
            }
        } catch (error) {
            console.error(`Error loading handler module ${file}:`, error);
        }
    }
}

export function initCore(client: Client) {

    loadHandlers(client, handlersFolder).then();
}
