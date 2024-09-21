import { Collection } from "discord.js";
import type DiscordCommand from "./discordCommand";

declare module "discord.js" {
	interface Client {
		commands: Collection<string, DiscordCommand> | undefined;
		updateCommands: () => Promise<Collection<string, DiscordCommand>>;
	}
}
