import {Component, MessageComponentInteraction, ModalSubmitInteraction} from 'discord.js';

export default abstract class Components extends Component {
    customId?: string;
    abstract execute(interaction: MessageComponentInteraction | ModalSubmitInteraction): void | Promise<void>;
}
