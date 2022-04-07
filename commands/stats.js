/**
 * This command provides the latest Wordle statistics for a given user.
 * 
 * Usage: /stats [User]
 * 
 * A user can provide another user as a parameter to look up their stats, or
 * omit the parameter to look up their own.
 * 
 * Current statistics include:
 *   - A solved puzzle percentage
 *   - An average score for solved puzzles
 *   - An embedded bar chart that displays all previous scores
 * 
 * Charts are generated using the QuickChart API: https://quickchart.io/
 */
const axios = require('axios');
const { SlashCommandBuilder } = require('@discordjs/builders');
const { database } = require('../firebase');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('stats')
    .setDescription('Displays the latest Wordle stats for a user.')
    .addUserOption(option =>
      option.setName('user')
        .setDescription('The user to look up stats for.')
        .setRequired(false)),

  async execute(interaction) {
    await interaction.deferReply();

    // Get user info from user option, or use caller ID if not provided
    let userId = interaction.user.id;
    let name = interaction.member.nick || interaction.member.nickname || interaction.user.username;
    if (interaction.options.getUser('user')) {
      userId = interaction.options.getUser('user').id;
      name = interaction.options.getUser('user').username;
    }

    // Get user snapshot from Firebase database
    const userSnapshot = await database.ref(`${interaction.guildId}/${userId}`).get();
    if (!userSnapshot.exists()) {
      await interaction.editReply("No Wordle stats found for this user.");
      return;
    }

    // Create totals dataset from snapshot
    const totals = userSnapshot.child('totals').val();
    const dataset = [];
    for (let i = 0; i < 7; i++) {
      dataset[i] = totals[i + 1] || 0;
    }

    // Construct QuickChart embed
    const chartData = {
      type: 'bar',
      data: {
        labels: [1, 2, 3, 4, 5, 6, "Unsolved"],
        datasets: [{
          label: name,
          data: dataset
        }]
      },
    };
    const embed = {
      image: {
        url: "https://quickchart.io/chart?bkg=white&c=" + encodeURIComponent(JSON.stringify(chartData))
      }
    }

    // Calculate solve percentage
    const totalPuzzles = dataset.reduce((p, c) => p + c, 0);
    const totalSolved = dataset.slice(0, 6).reduce((p, c) => p + c, 0);
    const solvePercentage = Math.round(((totalSolved / totalPuzzles * 100) + Number.EPSILON) * 100) / 100;

    // Calculate average guesses
    const guessesSum = dataset.slice(0, 6).reduce((p, c, i) => p + c * (i + 1), 0);
    const averageGuesses = Math.round(((guessesSum / totalSolved) + Number.EPSILON) * 100) / 100;

    // Construct stats message
    const message = `Wordle stats for ${name}:\n` + 
      `Solved: ${solvePercentage}%, Average: ${averageGuesses}`;

    // Send stats message with embedded chart
    await interaction.editReply({
      content: message,
      embeds: [embed],
    });
  }
}