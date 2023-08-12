const { SlashCommandBuilder } = require('discord.js');
const fetch = require('node-fetch');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('servers')
        .setDescription('Provides information about the game servers.'),
    async execute(interaction) {
        const cache = [];
        let initialEmbed;

        const serverInfoEmbed = {
            color: 0x27A724,
            description: '"**ARZ**" has long evolved past the original mod, we are now a team of people who have come together to bring you guys new experiences, and ways to play Call of Duty the way you love.\n\nWe have big plans to bring you guys more and more. We are working around the clock to not only improve on existing projects of ours, but also future projects as well.\n\u200B\nIf we ever decide to bring any of our projects back, or have any information regarding ARZ as a whole, you can expect to find it here.\n\nIf you\'re having issues and are looking to report a bug or player, please refer to <#1068974915555954779>.\n\nIf you\'re stuck and need help, please refer to our tutorials found in <#1068969262519169215>.\n\u200B\n',
            thumbnail: {
                url: 'http://arz.gg/assets/arz.png',
            },
            fields: [
                { name: 'IW4x', value: '\u200B' },
                { name: '[US] ARZ TDM #1', value: '', inline: true },
                { name: '[US] ARZ TDM #2', value: '', inline: true },
                { name: '\u200B', value: '\u200B' },
                { name: 'Plutonium IW5', value: '\u200B' },
                { name: '[US] JAM TDM #1', value: '', inline: true },
                { name: '[US] JAM TDM #2', value: '', inline: true },
                { name: '\u200B', value: '\u200B', inline: true },
                { name: '[US] JAM TDM #3', value: '', inline: true },
                { name: '[US] JAM FFA #1', value: '', inline: true },
                { name: '[US] JAM FFA #2', value: '', inline: true },
            ],
            footer: {
                text: '',
            },
        };

        const updateCache = async () => {
            fetch('http://arz.gg:1624/api/server')
                .then(response => response.json())
                .then(servers => {
                    cache.servers = servers;
                    updateEmbed();
                })
                .catch(error => {
                    cache.servers = [];
                    console.error(error);
                });
        };

        const updateEmbed = () => {
            if (cache.servers.length > 0) {
                const { fields, footer } = serverInfoEmbed;

                // update map and player count
                cache.servers.map(function ({ serverName, clientNum, maxClients, currentMap }) {
                    fields.forEach(field => {
                        if (serverName != field.name) return;
                        field.value = 'Map: ``' + currentMap.alias + '``\nPlayers: ``' + clientNum + '/' + maxClients + '``';
                    });
                });

                // update timestamp
                footer.text = `Last Updated • Today at ${new Date().toLocaleTimeString('en-US')}`;

                if (!initialEmbed) {
                    interaction.channel.send({ embeds: [serverInfoEmbed] })
                        .then(embed => initialEmbed = embed)
                        .catch(error => console.error(error));
                } else {
                    initialEmbed.edit({ embeds: [serverInfoEmbed] })
                        .catch(error => {
                            initialEmbed = undefined;
                            console.error(error);
                        });
                }
            } else {
                console.error('ERROR: Failed to update embed missing server data');
            }
        };

        const checkForActiveServer = () => {
            if (cache.servers.length > 0) {
                cache.servers.map(function ({ serverName, game, clientNum, currentMap }) {
                    if (clientNum < 5) return;

                    const pingRole = getGamePingRole(game);

                    pingRole ? interaction.guild.channels.cache
                        .get('1100821720136437781')
                        .send({ content: `<@&${pingRole}>, **${serverName}** is active with **${clientNum} players** on ${currentMap.alias}!` }) :
                        console.error(`ERROR: Failed to ping for active server ${serverName} missing game role.`);
                });
            } else {
                console.error('ERROR: Failed to check for active servers missing server data');
            }
        };

        const getGamePingRole = (game) => {
            switch (game) {
                case 'IW4':
                    return '1138885281953615963';
                case 'IW5':
                    return '1138885305152319568';
                default:
                    return undefined;
            }
        };

        setInterval(updateCache, 5000);
        setInterval(checkForActiveServer, 1000 * 60 * 60);

        await interaction.reply({
            content: 'Servers command executed successfully!', ephemeral: true
        });
    },
};