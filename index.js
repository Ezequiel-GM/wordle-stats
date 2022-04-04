const { Client, Intents } = require('discord.js');
const { token } = require('./config');

const client = new Client({ intents: [Intents.FLAGS.GUILDS ]});

client.once('ready', () => {
  console.log("WordleStats bot is running...");
});

client.on('interactionCreate', async interaction => {
  if (!interaction.isCommand()) return;

  if (interaction.commandName === 'user') {
    await interaction.reply(interaction.member.displayName);
    console.log("just replied with " + interaction.member.displayName);
  }
});

client.login(token);