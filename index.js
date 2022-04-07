const fs = require('node:fs');
const { Client, Collection, Intents } = require('discord.js');
const { token } = require('./config');

const client = new Client({ intents: [Intents.FLAGS.GUILDS ]});

client.once('ready', () => {
  console.log("WordleStats bot is running...");
});

// Collect all .js files from commands directory
client.commands = new Collection();
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

// Add commands to client
for (const file of commandFiles) {
  const command = require(`./commands/${file}`);
  client.commands.set(command.data.name, command);
}

// Respond to interactions that match one of the commands
client.on('interactionCreate', async interaction => {
  if (!interaction.isCommand()) return;

  const command = client.commands.get(interaction.commandName);

  if (!command) return;

  try {
    await command.execute(interaction);
  }
  catch (error) {
    console.error(error);
    await interaction.reply({ content: "There was an error while executing this command." });
  }
});

client.login(token);