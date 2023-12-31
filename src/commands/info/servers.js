const { SlashCommandBuilder } = require('discord.js');
const axios = require('axios');
const accurateInterval = require('accurate-interval');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('servers')
        .setDescription('Provides information about the game servers.'),
    async execute(interaction) {
        let servers = [];
        let initialEmbed;

        const serverInfoEmbed = {
            color: 0x27A724,
            description: '"**ARZ**" has long evolved past the original mod, we are now a team of people who have come together to bring you guys new experiences, and ways to play Call of Duty the way you love.\n\nWe have big plans to bring you guys more and more. We are working around the clock to not only improve on existing projects of ours, but also future projects as well.\n\u200B\nIf we ever decide to bring any of our projects back, or have any information regarding ARZ as a whole, you can expect to find it here.\n\nIf you\'re having issues and are looking to report a bug or player, please refer to <#1068974915555954779>.\n\nIf you\'re stuck and need help, please refer to our tutorials found in <#1068969262519169215>.\n\u200B\n',
            thumbnail: { url: 'http://arz.gg/assets/arz.png' },
            fields: [
                { name: 'IW4x', value: '\u200B' },
                { name: '[US] ARZ TDM', value: '', inline: true },
                { name: '[US] ARZ TDM #2', value: '', inline: true },
                { name: '[US] ARZ Bots', value: '', inline: true },
                { name: '\u200B', value: '\u200B' },
                { name: 'Plutonium IW5', value: '\u200B' },
                { name: '[US] JAM TDM', value: '', inline: true },
                { name: '[US] JAM TDM #2', value: '', inline: true },
                { name: '[US] JAM TDM | TACS', value: '', inline: true },
                { name: '[US] JAM Bots', value: '', inline: true },
                { name: '[US] JAM FFA', value: '', inline: true },
                { name: '[US] JAM FFA | TACS', value: '', inline: true },
            ],
            footer: { text: '' },
        };

        const updateCache = async () => {
            try {
                const response = await axios.get('http://arz.gg:1624/api/server', { signal: AbortSignal.timeout(300000) });
                servers = response.data;
                updateEmbed();
            } catch (error) {
                console.log(error);
            }
        };

        const updateEmbed = () => {
            if (servers.length <= 0) {
                console.error('ERROR: Failed to update embed missing server data');
                return;
            }

            // update map and player count
            servers.map(function ({ serverName, clientNum, maxClients, currentMap }) {
                serverInfoEmbed.fields.forEach(field => {
                    if (serverName != field.name) return;
                    field.value = 'Map: ``' + currentMap.alias + '``\nPlayers: ``' + clientNum + '/' + maxClients + '``';
                });
            });

            // update timestamp
            serverInfoEmbed.footer.text = `Last Updated • Today at ${new Date().toLocaleTimeString('en-US')}`;

            if (!initialEmbed) {
                interaction.channel.send({ embeds: [serverInfoEmbed] })
                    .then(embed => initialEmbed = embed)
                    .catch(error => console.error(error));
            } else {
                initialEmbed.edit({ embeds: [serverInfoEmbed] })
                    .catch(error => console.error(error));
            }
        };

        const checkForActiveServer = () => {
            if (servers.length <= 0) {
                console.error('ERROR: Failed to check for active servers missing server data');
                return;
            }

            servers
                .filter(({ serverName, clientNum }) => { serverName != '[US] JAM Tourney' && clientNum >= 5; })
                .map(function ({ serverName, game, clientNum, currentMap }) {
                    const pingRole = getGamePingRole(game);

                    pingRole ? interaction.guild.channels.cache
                        .get('1100821720136437781')
                        .send({ content: `<@&${pingRole}>, **${serverName}** is active with **${clientNum} players** on ${currentMap.alias}!` }) :
                        console.error(`ERROR: Failed to ping for active server ${serverName} missing game role.`);
                });
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

        accurateInterval(updateCache, 10000, { aligned: true, immediate: true });
        accurateInterval(checkForActiveServer, 1000 * 60 * 60, { aligned: true, immediate: true });

        await interaction.reply({
            content: 'Servers command executed successfully!', ephemeral: true
        });
    },
};