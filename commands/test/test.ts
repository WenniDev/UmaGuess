import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";
import type DiscordCommand from "../../interfaces/discordCommand";

export default {
	data: new SlashCommandBuilder()
		.setName("test")
		.setDescription('Replies with "Test!"'),
	async execute(interaction: ChatInputCommandInteraction) {
		try {
			return await interaction.reply("Testaaa!");
		} catch (error) {
			console.error(error);
		}
	},
} as DiscordCommand;
