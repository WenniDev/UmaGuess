import { ChatInputCommandInteraction, SlashCommandBuilder, SlashCommandStringOption } from "discord.js";
import type DiscordCommand from "../../interfaces/discordCommand";
import getCommands from "../../../src/getCommands";
import deployCommand from "../../deploy_commands";

export default {
	data: new SlashCommandBuilder()
		.setName("reload")
		.setDescription("Reloads the bot's commands")
		.addStringOption(opt => 
			opt.setName('command')
				.setDescription('Command to reload')
		),
	async execute(interaction: ChatInputCommandInteraction) {
		try {
			console.log(require.cache)
			const commands = await getCommands();
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
