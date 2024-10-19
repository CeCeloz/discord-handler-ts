import {Client} from "discord.js";
import {loadEvents} from "./handlers/EventsHandler.js";
import {loadSlashCommands} from "./handlers/SlashCommandsHandler.js";
import {loadComponents} from "./handlers/ComponentsHandler.js";

export function initCore(client: Client) {
    loadEvents(client, "../../../bot/src/events");
    loadSlashCommands(client, "../../../bot/src/commands");
    loadComponents(client, "../../../bot/src/components");
}
