import {Events, Message} from "discord.js";
import {Event} from "../models/Event.js";

const event: Event = {
    eventType: Events.MessageCreate,
    once: false,
    execute: (message: Message) => {
        if (message.content === 'hi') {
            message.channel.send('Hello!');
        }
    }
}

export default event;