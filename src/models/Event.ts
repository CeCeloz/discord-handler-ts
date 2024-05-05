import {Events} from "discord.js";

export interface Event {
    eventType: string | keyof typeof Events;
    once?: boolean;

    execute(...args: any[]): void;
}