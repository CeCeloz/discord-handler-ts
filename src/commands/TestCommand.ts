import {
    CommandInteraction,
    SlashCommandBuilder,
    PermissionFlagsBits,
    CommandInteractionOptionResolver,
    TextChannel,
    MessageResolvable
} from 'discord.js';

export const data = new SlashCommandBuilder()
    .setName('clear')
    .setDescription('This command is used to clear some messages on chat')
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages)
    .setDMPermission(false)
    .addNumberOption(options => options
        .setName("amount")
        .setDescription("provide the amount of messages to be cleared")
        .setMinValue(1)
        .setMaxValue(100)
        .setRequired(true)
    )
    .addChannelOption(options => options
        .setName("channel")
        .setDescription("provide the channel to be cleared")
        .setRequired(false)
    )
    .addUserOption(options => options
        .setName("user")
        .setDescription("the user you want to clear messages")
        .setRequired(false)
    )

export async function execute(interaction: CommandInteraction): Promise<void> {

    let options = interaction.options as CommandInteractionOptionResolver;

    let amount = options.getNumber("amount") as number
    let user = options.getUser("user")
    let channel = options.getChannel("channel") as TextChannel ? options.getChannel("channel") as TextChannel : interaction.channel as TextChannel


    if (user) {
        let i = 0
        let messagesToDelete: MessageResolvable[] = [];


        channel.messages.fetch().then((messages) => {
            messages.filter(message => {
                if (message.author.id === user?.id && i < amount) {
                    messagesToDelete.push(message)
                    i++
                }
            });


            channel.bulkDelete(messagesToDelete, true).then((messages) => {
                interaction.reply({
                    content: "Cleared " + messages.size,
                    ephemeral: true
                })
            })
        })

        return;
    }

    let i = 0;
    let messagesToDelete: MessageResolvable[] = [];

    channel.messages.fetch().then((messages => {
        messages.filter(message => {
            if (i < amount) {
                messagesToDelete.push(message)
                i++
            }
        });

        channel.bulkDelete(messagesToDelete, true).then((messages) => {
            interaction.reply({
                content: "Cleared " + messages.size,
                ephemeral: true
            })
        });
    }))
}