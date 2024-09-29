const {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  SlashCommandBuilder,
  EmbedBuilder,
  PermissionsBitField 
} = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("verification")
    .setDescription("Начать верификацию"),

  async execute(interaction) {
    global.ChoosenRank = null;
    console.log(`${interaction.user.username} started verification`);
    console.log(interaction.member.guild.name);
    
    const NewUserInfo = new EmbedBuilder()
      .setTitle("Верификация")
      .setColor("Grey")
      .setFooter({ text: "Верификация" })
      .setAuthor({ name: interaction.user.username })
      .setTimestamp();

    const r03 = new ButtonBuilder()
      .setCustomId("r03")
      .setLabel("R0-3")
      .setStyle(ButtonStyle.Secondary);

    const r4 = new ButtonBuilder()
      .setCustomId("r4")
      .setLabel("R4")
      .setStyle(ButtonStyle.Primary);

    const ally = new ButtonBuilder()
      .setCustomId("ally")
      .setLabel("Союзник")
      .setStyle(ButtonStyle.Success);

    const ranksRow = new ActionRowBuilder().addComponents(r03, r4, ally);

    const response = await interaction.reply({
      content: `Убедитесь, что ваш никнэйм совпадает с никнэймом в игре. \n Выберите свой ранг в альнсе`,
      components: [ranksRow],
    });

    const collectorFilter = (i) => i.user.id === interaction.user.id;


    try {
      const rank = await response.awaitMessageComponent({
        filter: collectorFilter,
        time: 600_000,
      });
      NewUserInfo.setColor("Yellow");
      NewUserInfo.addFields({
        name: "Состояние",
        value: "Ждет проверки ника и должности от R4-5",
      });
      const accept = new ButtonBuilder()
        .setCustomId("accept")
        .setLabel("Принять")
        .setStyle(ButtonStyle.Success);

      const decline = new ButtonBuilder()
        .setCustomId("decline")
        .setLabel("Отклонить")
        .setStyle(ButtonStyle.Danger);
      const acceptRow = new ActionRowBuilder().addComponents(accept, decline);

      if (rank.customId === "r03") {
        NewUserInfo.addFields({ name: "Ранг", value: "R0-3", inline: true });
        ChoosenRank = "1289964024754077707";
        await rank.update({
          content: `Ожидает подтверждения`,
          embeds: [NewUserInfo],
          components: [acceptRow],
        });
      } else if (rank.customId === "r4") {
        NewUserInfo.addFields({ name: "Ранг", value: "R4", inline: true });
        ChoosenRank = "1289962490901561478";
        await rank.update({
          content: `Ожидает подтверждения`,
          embeds: [NewUserInfo],
          components: [acceptRow],
        });
      } else if (rank.customId === "ally") {
        NewUserInfo.addFields({ name: "Ранг", value: "Союзник", inline: true });
        ChoosenRank = "1289964152038752257";
        await rank.update({
          embeds: [NewUserInfo],
          components: [acceptRow],
        });
      }
    } catch (error) {
      console.log(error);
    }
    
    const R45collectorFilter = (i) => i.member.permissions.has(PermissionsBitField.Flags.ManageRoles)

    try {
      const verificationAproved = await response.awaitMessageComponent({
        filter: R45collectorFilter,
        time: 6000_000,
      });
      if (verificationAproved.customId === "accept") {
        NewUserInfo.setColor("Green");
        NewUserInfo.setFields({
          name: "Состояние",
          value: "Верификация пройдена",
          inline: true,
        });
        await interaction.member.roles.add(ChoosenRank);
        await verificationAproved.update({
          content: "",
          embeds: [NewUserInfo],
          components: [],
        });
      } else if (verificationAproved.customId === "decline") {
        NewUserInfo.setColor("Red");
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
    }
  },
};
