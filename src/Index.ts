import { Client, GatewayIntentBits } from 'discord.js'
import { config } from 'dotenv'
import { readdirSync } from 'fs';

config();

const client = new Client({
  intents: [
		GatewayIntentBits.Guilds,
		GatewayIntentBits.GuildMessages,
		GatewayIntentBits.MessageContent,
		GatewayIntentBits.GuildMembers,
  ]
});


const handlersFolder = readdirSync('./src/handlers').filter((file) => file.endsWith('.ts'))

for (const file of handlersFolder) {
  import(`./handlers/${file}`).then((func) => func.default(client))
  console.log(`Handlers ${file} loaded`)
}



client.login(process.env.BOT_TOKEN);
