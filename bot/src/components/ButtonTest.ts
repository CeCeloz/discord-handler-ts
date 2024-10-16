import {ButtonInteraction} from "discord.js";


const button =  {
    customId: 'confirm',
    execute: async (interaction: ButtonInteraction ): Promise<void> => {
        await interaction.update({
            content: 'Button Clicked',
            components: [],
        });
    }
};

export default button;
