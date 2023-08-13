const { ActionRowBuilder, EmbedBuilder, SlashCommandBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('roles')
        .setDescription('Provides a game ping role embed and select menu.'),
    async execute(interaction) {
        const embed = new EmbedBuilder()
            .setColor('#27A724')
            .setDescription('**Interact below to be pinged when a server is active.**');

        const selectMenu = new ActionRowBuilder()
            .addComponents(
                new StringSelectMenuBuilder()
                    .setCustomId('roles')
                    .setPlaceholder('Make a selection!')
                    .setMinValues(0)
                    .setMaxValues(2)
                    .addOptions(
                        new StringSelectMenuOptionBuilder()
                            .setLabel('MW2')
                            .setDescription('Be notified when an MW2 server is active.')
                            .setValue('mw2')
                            .setEmoji('1121330701489414244'),
                        new StringSelectMenuOptionBuilder()
                            .setLabel('MW3')
                            .setDescription('Be notified when an MW3 server is active.')
                            .setValue('mw3')
                            .setEmoji('1140207493503524874'),
                    )
            );

        await interaction.channel.send({
            embeds: [embed],
            components: [selectMenu],
        });

        await interaction.reply({
            content: 'Roles command executed successfully!', ephemeral: true
        });
    },
};