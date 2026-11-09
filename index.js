const { Client, GatewayIntentBits, Events, Collection } = require('discord.js');
const config = require('./config');

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ]
});

client.commands = new Collection();

// Load event
const eventGuildMemberAdd = require('./events/guildMemberAdd');
const eventGuildMemberRemove = require('./events/guildMemberRemove');

client.once(Events.ClientReady, (c) => {
  console.log(`✅ Bot ${c.user.tag} siap digunakan!`);
  console.log(`   Terhubung ke ${c.guilds.cache.size} server.`);
});

client.on(Events.GuildMemberAdd, (member) => {
  eventGuildMemberAdd.execute(member).catch(console.error);
});

client.on(Events.GuildMemberRemove, (member) => {
  eventGuildMemberRemove.execute(member).catch(console.error);
});

client.login(config.token);