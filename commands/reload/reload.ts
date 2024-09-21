import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";
import type DiscordCommand from "../../interfaces/discordCommand";
import getCommands from "../../getCommands";
import deployCommand from "../../deploy_commands";

export default {
	data: new SlashCommandBuilder()
		.setName("reload")
		.setDescription("Reloads the bot's commands"),
	async execute(interaction: ChatInputCommandInteraction) {
		try {
			console.log(require.cache)
			interaction.client.commands = await getCommands();
			deployCommand(interaction.client.commands).then(() => {
				console.log(`Successfully deployed ${interaction.client.commands?.size} commands`);
			});
			
			return await interaction.reply({
				content: `Reloaded ${interaction.client.commands.size} commands`,
				ephemeral: true,
			});
		} catch (error) {
			console.error(error);
		}
	},
} as DiscordCommand;
