const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('help')
    .setDescription('Get help using the WordleStats bot.'),
  
  async execute(interaction) {
    const helpMessage =
      "Welcome to **WordleStats!**\n" +
      "\n" +
      "Using this bot, you can track Wordle statistics for members of this server. " +
      "Enter one of the following commands to begin:\n" +
      "\n" +
      ">>> **/add**  [Puzzle]  [# of Guesses]\n" +
      "Add a new Wordle result to your statistics.\n" +
      "\n" +
      "**/stats**  \[User\] \(optional\)\n" +
      "Display the latest statistics for you or another member of your server.";

    await interaction.reply(helpMessage);
  }
}