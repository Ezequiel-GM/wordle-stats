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

    const puzzle = interaction.options.getInteger('puzzle');
    const guesses = interaction.options.getInteger('guesses');
    const nickname = interaction.member.nick || interaction.member.nickname || interaction.user.username;
    const userRef = database.ref(`${interaction.guildId}/${interaction.user.id}`);

    const scoreSnapshot = await userRef.child(puzzle).get();
    if (scoreSnapshot.exists()) {
      await userRef.child(`totals/${scoreSnapshot.val()}`).transaction(total => total - 1);
    }

    await userRef.child(puzzle).set(guesses);

    await userRef.child(`totals/${guesses}`).transaction(total => (total || 0) + 1);

    if (guesses > 0) {
      await interaction.editReply(`${nickname} guessed Wordle #${puzzle} in ${guesses} guesses!`);
    }
    else {
      await interaction.editReply(`${nickname} didn't solve Wordle #${puzzle}. Better luck next time!`);
    }
  }
}