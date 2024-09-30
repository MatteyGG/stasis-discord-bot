const {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  SlashCommandBuilder,
  EmbedBuilder,
  PermissionsBitField 
} = require("discord.js");
const {r0, r1, r2, r3, r4, ally, verificationRole, non_verificationRole} = require('../../config.json');
module.exports = {
  data: new SlashCommandBuilder()
    .setName("verification")
    .setDescription("Начать верификацию")
    .setDescriptionLocalizations({
      "ru": "Начать верификацию",
      "en-US": "Start verification"
    }),

  async execute(interaction) {
    // Reset the global variables
    global.ChoosenRank = null;
    global.ChoosenRankText = null;

    // Log the event
    console.log(`${interaction.user.username} started verification`);
    console.log(interaction.member.guild.name);

    // Create an embed with information about the verification process
    const NewUserInfo = new EmbedBuilder()
      .setTitle("Верификация")
      .setDescription("Убедитесь, что никнэйм на сервере совпадает с никнэймом в игре.\n Выберите ранг. \n Be sure that your nickname matches the nickname in the game. Select a rank.")
      .setColor("Grey")
      .setFooter({ text: "Верификация" })
      .setAuthor({ name: interaction.user.username, iconURL: interaction.user.displayAvatarURL() })

      .setTimestamp();

    // Create buttons for each rank

    const r1Button = new ButtonBuilder()
      .setCustomId("r1")
      .setLabel("R1")
      .setStyle(ButtonStyle.Primary);

    const r2Button = new ButtonBuilder()
      .setCustomId("r2")
      .setLabel("R2")
      .setStyle(ButtonStyle.Primary);

    const r3Button = new ButtonBuilder()
      .setCustomId("r3")
      .setLabel("R3")
      .setStyle(ButtonStyle.Primary);

    const r4Button = new ButtonBuilder()
      .setCustomId("r4")
      .setLabel("R4")
      .setStyle(ButtonStyle.Primary);

    const allyButton = new ButtonBuilder()
      .setCustomId("ally")
      .setLabel("Союзник")
      .setStyle(ButtonStyle.Success);

    // Create a row with all the buttons
    const ranksRow = new ActionRowBuilder().addComponents( r1Button, r2Button, r3Button, r4Button, allyButton);

    // Send the embed and the row with buttons to the user
    const response = await interaction.reply({
      embeds: [NewUserInfo],
      components: [ranksRow],
    });

    // Create a filter for the collector
    const collectorFilter = (i) => i.user.id === interaction.user.id;

    try {
      // Wait for the user to select a rank
      const rank = await response.awaitMessageComponent({
        filter: collectorFilter,
        time: 600_000,
      });

      // Create a new embed with information about the selected rank
      NewUserInfo.setColor("Yellow");
      NewUserInfo.setDescription("Ожидает подтверждения от R4-5. Прикрепите скриншот своего профиля в игре, чтоб ускорить процесс. \n Waiting for approval from R4-5. Attach your profile screenshot from game, so it takes less time. ");
      const accept = new ButtonBuilder()
        .setCustomId("accept")
        .setLabel("Принять")
        .setStyle(ButtonStyle.Success);

      const decline = new ButtonBuilder()
        .setCustomId("decline")
        .setLabel("Отклонить")
        .setStyle(ButtonStyle.Danger);
      const acceptRow = new ActionRowBuilder().addComponents(accept, decline);

      // Update the embed with the selected rank and the buttons
      if (rank.customId === "r0") {
        NewUserInfo.addFields({ name: "Ранг", value: "R0", inline: true });
        global.ChoosenRank = r0;
        global.ChoosenRankText = "R0";
        await rank.update({
          embeds: [NewUserInfo],
          components: [acceptRow],
        });
      } else if (rank.customId === "r1") {
        NewUserInfo.addFields({ name: "Ранг", value: "R1", inline: true });
        global.ChoosenRank = r1;
        global.ChoosenRankText = "R1";
        await rank.update({
          embeds: [NewUserInfo],
          components: [acceptRow],
        });
      } else if (rank.customId === "r2") {
        NewUserInfo.addFields({ name: "Ранг", value: "R2", inline: true });
        global.ChoosenRank = r2;
        global.ChoosenRankText = "R2";
        await rank.update({
          embeds: [NewUserInfo],
          components: [acceptRow],
        });
      } else if (rank.customId === "r3") {
        NewUserInfo.addFields({ name: "Ранг", value: "R3", inline: true });
        global.ChoosenRank = r3;
        global.ChoosenRankText = "R3";
        await rank.update({
          embeds: [NewUserInfo],
          components: [acceptRow],
        });
      } else if (rank.customId === "r4") {
        NewUserInfo.addFields({ name: "Ранг", value: "R4", inline: true });
        global.ChoosenRank = r4;
        global.ChoosenRankText = "R4";
        await rank.update({
          embeds: [NewUserInfo],
          components: [acceptRow],
        });
      } else if (rank.customId === "ally") {
        NewUserInfo.addFields({ name: "Ранг", value: "Союзник", inline: true });
        global.ChoosenRank = ally;
        global.ChoosenRankText = "Союзник";
        await rank.update({
          embeds: [NewUserInfo],
          components: [acceptRow],
        });
      }
    } catch (error) {
      console.log(error);
      NewUserInfo.setColor("Red");
      NewUserInfo.setDescription("\u200B")
      NewUserInfo.setFields({
        name: "Состояние",
        value: "Верификация отклонена, время на заполнение вышло",
        inline: true,
      })
      await response.update({
        content: "",
        embeds: [NewUserInfo],
        components: [],
      })
    }

    // Create a filter for the collector

    const R45collectorFilter = (i) => i.member.permissions.has(PermissionsBitField.Flags.ManageRoles)

    try {
      // Wait for the user to accept or decline the verification
      const verificationAproved = await response.awaitMessageComponent({
        filter: R45collectorFilter,
        time: 6000_000,
      });
      if (verificationAproved.customId === "accept") {
        NewUserInfo.setColor("Green");
        NewUserInfo.setDescription("\u200B")
        NewUserInfo.setFields({
          name: "Состояние",
          value: "Верификация пройдена",
          inline: true,
        }, { name: "Ранг", value: global.ChoosenRankText, inline: true });
        await interaction.member.roles.add(global.ChoosenRank);
        await interaction.member.roles.remove(non_verificationRole);
        await interaction.member.roles.add(verificationRole);
        await verificationAproved.update({
          content: "",
          embeds: [NewUserInfo],
          components: [],
        });
      } else if (verificationAproved.customId === "decline") {
        NewUserInfo.setColor("Red");
        NewUserInfo.setDescription("\u200B")
        NewUserInfo.setFields({
          name: "Состояние",
          value: "Верификация отклонена",
          inline: true,
        });

        await verificationAproved.update({
          content: "",
          embeds: [NewUserInfo],
          components: [],
        });
      }
    } catch (error) {
      console.log(error);
      NewUserInfo.setColor("Red");
      NewUserInfo.setDescription("\u200B")
      NewUserInfo.setFields({
        name: "Состояние",
        value: "Верификация отклонена, время на одобрение вышло. \nПопробуйте ещё раз, если это не помогает, обратитесь к администратору",
        inline: true,
      })
      await response.update({
        content: "",
        embeds: [NewUserInfo],
        components: [],
      })
    }
  },
};
