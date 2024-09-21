import { Glob } from "bun";
import { Collection } from "discord.js";
import fs from "node:fs";
import path from "node:path";
import type DiscordCommand from "./interfaces/discordCommand";

const foldersPath = path.join(__dirname, "commands");
const commandFolders = fs.readdirSync(foldersPath);
const glob = new Glob("*.ts");

export default async function getCommands(): Promise<
	Collection<string, DiscordCommand>
> {
	let commands = new Collection<string, DiscordCommand>();

	for (const folder of commandFolders) {
		const commandsPath = path.join(foldersPath, folder);
		const commandFiles = glob.scanSync(commandsPath);
		for (const file of commandFiles) {
			const filePath = path.join(commandsPath, file);
			const command = (await import(filePath)).default as DiscordCommand;
			if (!command) continue;
			if (!command?.data) continue;
			if (!command?.execute) continue;

			commands.set(command?.data.name, command);
		}
	}
	return commands;
}
