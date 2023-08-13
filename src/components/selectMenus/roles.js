module.exports = {
    name: 'roles',
    async execute(interaction) {
        const gameRoles = [
            ['mw2', '1138885281953615963'],
            ['mw3', '1138885305152319568'],
        ];

        gameRoles.forEach(role => {
            if (interaction.values.includes(role[0])) {
                interaction.member.roles.add(role[1]);
            } else {
                interaction.member.roles.remove(role[1]);
            }
        });

        interaction.reply({ content: 'Roles Updated...', ephemeral: true });
    }
};