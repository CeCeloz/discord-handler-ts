import { ClientEvents } from "discord.js";

export interface Event {
    name: string;
    eventType: keyof ClientEvents;
    once?: boolean;

    execute(...args: any[]): void;
}