import {
    ButtonInteraction,
    StringSelectMenuInteraction,
    UserSelectMenuInteraction,
    RoleSelectMenuInteraction,
    MentionableSelectMenuInteraction,
    ChannelSelectMenuInteraction,
    ModalSubmitInteraction,
} from 'discord.js';

export type CustomIdInteraction =
    | ButtonInteraction
    | StringSelectMenuInteraction
    | UserSelectMenuInteraction
    | RoleSelectMenuInteraction
    | MentionableSelectMenuInteraction
    | ChannelSelectMenuInteraction
    | ModalSubmitInteraction;

export interface Component {
    customId: string;
    execute: (interaction: CustomIdInteraction) => Promise<void>;
}