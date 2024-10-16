import {ModalSubmitInteraction} from "discord.js";

const modal =  {
    customId: 'test',
    execute: async (interaction: ModalSubmitInteraction ): Promise<void> => {
        await interaction.reply(
            {
                content: 'Modal Submitted',
                ephemeral: true,
            }
        )
    }
};

export default modal;
