import { ChatInputCommandInteraction, SlashCommandBuilder, SlashCommandStringOption, type APIApplicationCommandOptionChoice, type RestOrArray } from "discord.js";
import type DiscordCommand from "../../interfaces/discordCommand";
import CommandUpdater from "../../CommandUpdater";
import logger from "../../logger";

export default {
	data: new SlashCommandBuilder()
		.setName("reload")
		.setDescription("Reloads the bot's commands")
		.addStringOption(opt => 
			opt.setName('command')
				.setDescription('Command to reload')
				.setRequired(true)
		),
	async execute(interaction: ChatInputCommandInteraction) {
		const commandName = interaction.options.getString('command', true).toLowerCase();
		const command = interaction.client.commands?.get(commandName);

		try {
			if (!command) throw new SyntaxError("no commands founds")

			delete require.cache[require.resolve(`../${command?.data.name}/${command?.data.name}.ts`)];
			const newCommand = await CommandUpdater.get(command);
			interaction.client.commands?.set(command.data.name, newCommand);
			return await interaction.reply({
				content: `Reloaded "${newCommand.data.name}" command`,
				ephemeral: true,
			});
		} catch (e) {
			if (e instanceof SyntaxError)
				logger.error(`[reload] ${interaction.member?.user.username} tried to reload "${commandName}" but the command does not exist`)
				return await interaction.reply({
				content: `"${commandName}" does not exist`,
				ephemeral: true,
			})
		}
	},
} as DiscordCommand;
