import {Client, Events} from "discord.js";
import {Event} from "../models/Event.js";

const event: Event = {
    name: "eventReady",
    eventType: Events.ClientReady,
    once: true,
    execute: (client: Client) => {
        console.log(`Logged in as ${client.user?.tag}`);
    }
}


export default event;