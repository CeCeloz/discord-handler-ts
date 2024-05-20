import {Client, GatewayIntentBits} from 'discord.js'
import {config} from 'dotenv'
import {readdirSync} from 'fs';

config();

const client: Client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMembers,
    ]
});


const handlersFolder: string[] = readdirSync('./src/handlers').filter((file) => file.endsWith('.ts'))

async function loadHandlers(client: Client, handlersFolder: string[]) {
    for (const file of handlersFolder) {
        try {
            const module = await import(`./handlers/${file}`);
            for (const [key, func] of Object.entries(module)) {
                if (typeof func === 'function') {
                    func(client);
                    console.log(`Handler ${key} from ${file} loaded`);
                }
            }
        } catch (error) {
            console.error(`Error loading handler ${file}:`, error);
        }
    }
}

loadHandlers(client, handlersFolder).then();
client.login(process.env.BOT_TOKEN).then()
