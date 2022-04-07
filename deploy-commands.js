/**
 * This script is used to deploy the WordleStats bot's slash commands to the
 * Discord servers it is used in. Each time the commands' metadata changes, this
 * script must be run to ensure servers provide users with the correct command
 * suggestions.
 * 
 * The deployment can take up to an hour to propagate in production. In
 * development it is instantaneous.
 */
const fs = require('node:fs');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const { clientId, guildId, token } = require('./config');

// Collect command metadata from commands directory
const commands = [];
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
for (const file of commandFiles) {
  const command = require(`./commands/${file}`);
  commands.push(command.data.toJSON());
}

const rest = new REST({ version: '9' }).setToken(token);

// When run in a development environment, guildId is set to the development server id
if (guildId !== undefined) {
  rest.put(Routes.applicationGuildCommands(clientId, guildId), { body: commands })
    .then(() => console.log("Successfully registered application commands."))
    .catch(console.error);
}
else {
  rest.put(Routes.applicationCommands(clientId), { body: commands })
    .then(() => console.log("Successfully registered application commands."))
    .catch(console.error);
}
