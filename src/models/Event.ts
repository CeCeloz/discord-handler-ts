import {Events} from "discord.js";

export interface Event {
    name: string;
    eventType: string | keyof typeof Events;
    once?: boolean;

    execute(...args: any[]): void;
}