import type {
	AutocompleteInteraction,
	ChatInputCommandInteraction,
	CommandInteraction,
	InteractionResponse,
	SlashCommandBuilder,
} from "discord.js";

export default interface DiscordCommand {
	data: SlashCommandBuilder;
	
	autocomplete: (
		interaction: AutocompleteInteraction,
	) => Promise<any> | undefined;
	
	execute: (
		interaction: ChatInputCommandInteraction | CommandInteraction,
	) => Promise<InteractionResponse<boolean>>;

}
