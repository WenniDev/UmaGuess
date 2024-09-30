import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";
import type DiscordCommand from "../../interfaces/discordCommand";
import umamusumelist from '../../../assets/umaList.json'

function start_umaguess() {
	
}

export default {
	data: new SlashCommandBuilder()
		.setName("guess_uma")
		.setDescription('Start the UmaGuess minigame.')
		.addStringOption(opt => 
			opt.setName("umamusume")
				.setDescription("Uma Musume name.")
				.setAutocomplete(true)
				.setRequired(true)
		),

	async autocomplete(interaction) {
		const focusedValue = interaction.options.getFocused().toLowerCase();
		let umaList = umamusumelist.map(uma => uma.name_en);
		let filtered = umaList.filter(choice => choice.toLowerCase().startsWith(focusedValue));
		if (filtered.length > 25) filtered = filtered.slice(0, 15);
		await interaction.respond(
			filtered.map(choice => ({ name: choice, value: choice })),
		);
	},

	async execute(interaction: ChatInputCommandInteraction) {
		try {
			start_umaguess()
			return await interaction.reply("Testaaaaa!");
		} catch (error) {
			console.error(error);
		}
	},
} as DiscordCommand;
