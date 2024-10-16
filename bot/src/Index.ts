import {Client, GatewayIntentBits} from 'discord.js'
import {config} from 'dotenv'
import {initCore} from '../../core/src/Index.js'

config();

const client: Client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMembers,
    ]
});

initCore(client);

client.login(process.env.BOT_TOKEN).then()
