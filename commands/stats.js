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

    // Get user info from options, or use caller ID if not provided
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

    // Construct QuickChart URL
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
    const url = "https://quickchart.io/chart?bkg=white&c=" + encodeURIComponent(JSON.stringify(chartData));

    // Reply with URL embedded image
    const embed = {
      image: {
        url: url
      }
    }
    await interaction.editReply({
      embeds: [embed]
    });
  }
}