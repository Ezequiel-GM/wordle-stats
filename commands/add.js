/**
 * This command adds a new score to the user's statistics, or updates the score
 * for the provided puzzle if already present.
 * 
 * Usage: /add [Puzzle] [Score]
 * 
 * A user can only update their own scores, so the caller ID is used to identify
 * which stats to update.
 */

const { SlashCommandBuilder } = require('@discordjs/builders');
const { database } = require('../firebase');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('add')
    .setDescription('Add a result to your Wordle stats.')
    .addIntegerOption(option =>
      option.setName('puzzle')
      .setDescription('Which Wordle puzzle to add stats for.')
      .setRequired(true))
    .addIntegerOption(option =>
      option.setName('guesses')
        .setDescription('How many guesses it took you to solve the Wordle.')
        .addChoice('1', 1)
        .addChoice('2', 2)
        .addChoice('3', 3)
        .addChoice('4', 4)
        .addChoice('5', 5)
        .addChoice('6', 6)
        .addChoice('Unsolved', 7)
        .setRequired(true)),
  
  async execute(interaction) {
    await interaction.deferReply();

    // Collect command options and user information
    const puzzle = interaction.options.getInteger('puzzle');
    const guesses = interaction.options.getInteger('guesses');
    const nickname = interaction.member.nick || interaction.member.nickname || interaction.user.username;
    const userRef = database.ref(`${interaction.guildId}/${interaction.user.id}`);

    // If score is already present, decrement the totals for the previous score
    const scoreSnapshot = await userRef.child(puzzle).get();
    if (scoreSnapshot.exists()) {
      await userRef.child(`totals/${scoreSnapshot.val()}`).transaction(total => total - 1);
    }

    // Add new score and increment totals
    await userRef.child(puzzle).set(guesses);
    await userRef.child(`totals/${guesses}`).transaction(total => (total || 0) + 1);

    // Respond with an appropriate message, depending on score
    if (guesses === 1) {
      await interaction.editReply(`${nickname} solved Wordle #${puzzle} in ${guesses} guess!`);
    }
    else if (guesses <= 6) {
      await interaction.editReply(`${nickname} solved Wordle #${puzzle} in ${guesses} guesses!`);
    }
    else {
      await interaction.editReply(`${nickname} didn't solve Wordle #${puzzle}. Better luck next time!`);
    }
  }
}