const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('help')
    .setDescription('Get help using the WordleStats bot.'),
  
  async execute(interaction) {
    const helpMessage =
      "Welcome to **WordleStats!**\n" +
      "\n" +
      "For full documentation, see the [public readme](https://github.com/Ezequiel-GM/wordle-stats/blob/main/README.md).\n" +
      "\n" +
      "Using this bot, you can track Wordle statistics for members of this server. " +
      "Enter one of the following commands to begin:\n" +
      "\n" +
      ">>> **/add**  [puzzle]  [guesses]\n" +
      "Add a new Wordle score to your statistics.\n" +
      "\n" +
      "**/stats**  [user]\n" +
      "Display the latest statistics for you or another member of your server.";

    await interaction.reply(helpMessage);
  }
}