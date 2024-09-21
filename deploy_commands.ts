import { Collection, REST, Routes } from "discord.js";
import { client_id, guild_id } from "./config.json";
import type DiscordCommand from "./interfaces/discordCommand";

const rest = new REST().setToken(process.env.DISCORD_TOKEN as string);

export default async function deployCommand(
	commands: Collection<string, DiscordCommand>,
): Promise<Collection<string, DiscordCommand>> {
	rest.put(Routes.applicationGuildCommands(client_id, guild_id), {
		body: commands.map((command) => {
			return command.data.toJSON();
		}),
	}).catch((error) => console.error(error));

	return commands;
}
