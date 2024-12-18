import {ClientEvents} from "discord.js";

export default abstract class Event {
    abstract name: string;
    abstract eventType: keyof ClientEvents;
    abstract once?: boolean;

    protected abstract execute(...args: any): void | Promise<void>;
}
