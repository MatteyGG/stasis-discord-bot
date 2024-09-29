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
    .setDescription("Начать верификацию"),

  async execute(interaction) {
    global.ChoosenRank = null;
    console.log(`${interaction.user.username} started verification`);
    console.log(interaction.member.guild.name);
    
    const NewUserInfo = new EmbedBuilder()
      .setTitle("Верификация")
      .setColor("Grey")
      .setFooter({ text: "Верификация" })
      .setAuthor({ name: interaction.user.username, iconURL: interaction.user.displayAvatarURL() })

      .setTimestamp();
    const r0Button = new ButtonBuilder()
      .setCustomId("r0")
      .setLabel("R0")
      .setStyle(ButtonStyle.Primary);
    
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

    const ranksRow = new ActionRowBuilder().addComponents(r0Button, r1Button, r2Button, r3Button, allyButton);

    const response = await interaction.reply({
      content: `Убедитесь, что ваш никнэйм совпадает с никнэймом в игре. \nПосле, Выберите свой ранг в альнсе`,
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
      if (rank.customId === "r0") {
        NewUserInfo.addFields({ name: "Ранг", value: "R0", inline: true });
        ChoosenRank = r0;
        await rank.update({
          content: `Ожидает подтверждения от R4-5`,
          embeds: [NewUserInfo],
          components: [acceptRow],
        });
      } else if (rank.customId === "r1") {
        NewUserInfo.addFields({ name: "Ранг", value: "R1", inline: true });
        ChoosenRank = r1;
        await rank.update({
          content: `Ожидает подтверждения от R4-5`,
          embeds: [NewUserInfo],
          components: [acceptRow],
        });
      } else if (rank.customId === "r2") {
        NewUserInfo.addFields({ name: "Ранг", value: "R2", inline: true });
        ChoosenRank = r2;
        await rank.update({
          content: `Ожидает подтверждения от R4-5`,
          embeds: [NewUserInfo],
          components: [acceptRow],
          })}
      if (rank.customId === "r3") {
        NewUserInfo.addFields({ name: "Ранг", value: "R3", inline: true });
        ChoosenRank = r3;
        await rank.update({
          content: `Ожидает подтверждения от R4-5`,
          embeds: [NewUserInfo],
          components: [acceptRow],
        });
      } else if (rank.customId === "r4") {
        NewUserInfo.addFields({ name: "Ранг", value: "R4", inline: true });
        ChoosenRank = r4;
        await rank.update({
          content: `Ожидает подтверждения от R4-5`,
          embeds: [NewUserInfo],
          components: [acceptRow],
        });
      } else if (rank.customId === "ally") {
        NewUserInfo.addFields({ name: "Ранг", value: "Союзник", inline: true });
        ChoosenRank = ally;
        await rank.update({
          content: `Ожидает подтверждения от R4-5`,
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
        await interaction.member.roles.remove(non_verificationRole);
        await interaction.member.roles.add(verificationRole);
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
