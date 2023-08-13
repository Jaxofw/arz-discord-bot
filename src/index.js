require('dotenv').config();

const { Client, Collection, GatewayIntentBits } = require('discord.js');
const { token } = process.env;

// Create a new client instance
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildMessageReactions,
        GatewayIntentBits.GuildPresences,
        GatewayIntentBits.MessageContent,
    ],
    partials: ['CHANNEL', 'MESSAGE', 'GUILD', 'REACTION'],
});

// Collections
client.commands = new Collection();
client.selectMenus = new Collection();

// Fetch handlers
['commands', 'components', 'events'].forEach(handler => require(`./handlers/${handler}`)(client));

// Log in to Discord with your client's token
client.login(token);
