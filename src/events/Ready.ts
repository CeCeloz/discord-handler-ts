import { Client, Events } from "discord.js";
import { Event } from "../models/Event.js";

const event: Event = {
  eventType: Events.ClientReady,
  once: true,
  execute: (client: Client) => {
    console.log(`Logged in as ${client.user.tag}`);
  }
}


export default event;