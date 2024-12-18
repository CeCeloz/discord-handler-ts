import {ClientEvents, Events, GuildMember, TextChannel, ThreadChannel} from "discord.js";
import Event from "../../../core/src/models/Event.js";

export default class ReadyEvent extends Event {
    name = "ready";
    eventType: keyof ClientEvents = Events.ClientReady;
    once = false;

    async execute(member: GuildMember) {

    }
}
